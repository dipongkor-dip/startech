// rabbitmq.ts
import amqp from "amqplib";
import env from "../env";
import {categoryCheckListener} from "../modules/categories/categories.consumer";
import {randomUUID} from "crypto";

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
  if (channel) return channel;

  const conn = await amqp.connect(env.rabbitmq_url);
  channel = await conn.createChannel();
  console.log("✅ RabbitMQ connected");

  // Common queues assert
  await channel.assertQueue("category_check");
  await channel.assertQueue("category_response");

  // Attach all listeners
  categoryCheckListener(channel);

  return channel;
};

export const sendRpcMessage = async <T>(requestQueue: string, responseQueue: string, payload: object): Promise<T> => {
  await channel.assertQueue(requestQueue);
  await channel.assertQueue(responseQueue);

  const correlationId = randomUUID();

  channel.sendToQueue(requestQueue, Buffer.from(JSON.stringify({...payload, correlationId})), {correlationId});

  return new Promise<T>((resolve, reject) => {
    const consumerTag = `consumer-${correlationId}`;

    channel.consume(
      responseQueue,
      (msg) => {
        if (!msg) return;

        const response = JSON.parse(msg.content.toString());

        if (msg.properties.correlationId === correlationId) {
          channel.ack(msg);
          channel.cancel(consumerTag);
          resolve(response);
        }
      },
      {noAck: false, consumerTag},
    );
  });
};
