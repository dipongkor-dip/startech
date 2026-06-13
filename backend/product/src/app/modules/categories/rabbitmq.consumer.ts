// categoryService.ts

import {getChannel} from "../../config/rabbitmq";
import {category} from "./categories.model";

export const startCategoryConsumer = async () => {
  const channel = getChannel();

  await channel.assertQueue("category_check");
  await channel.assertQueue("category_response");

  channel.consume("category_check", async (msg) => {
    if (!msg) return;
    const payload = JSON.parse(msg.content.toString());

    const categoryExists = await category.findById(payload.categoryId, {isActive: true}).select("_id").exec();

    channel.sendToQueue("category_response", Buffer.from(JSON.stringify({exists: !!categoryExists})));
    channel.ack(msg);
  });
};
