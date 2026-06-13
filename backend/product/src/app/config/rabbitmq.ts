// rabbitmq.ts
import amqp from "amqplib";
import env from "../env";
import {registerCategoryCheckListener} from "../modules/categories/categories.consumer";

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
  registerCategoryCheckListener(channel);

  return channel;
};

export const getChannel = () => channel as amqp.Channel;
