// rabbitmq.ts
import amqp from "amqplib";
import {env} from "../env";

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
  if (channel) return channel;

  const conn = await amqp.connect(env.rabbitmq_url);
  channel = await conn.createChannel();
  console.log("✅ RabbitMQ connected");
  return channel;
};

export const getChannel = () => channel;
