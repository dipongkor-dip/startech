import amqp from "amqplib";
import {category} from "./categories.model";
/**
 * Listener for category_check queue
 */
export const registerCategoryCheckListener = (channel: amqp.Channel) => {
  channel.consume("category_check", async (msg: any) => {
    if (!msg) return;

    try {
      const payload = JSON.parse(msg.content.toString());

      const categoryExists = await category.findById(payload.categoryId, {isActive: true}).select("_id").exec();

      channel.sendToQueue(
        "category_response",
        Buffer.from(
          JSON.stringify({
            exists: !!categoryExists,
            correlationId: payload.correlationId,
          }),
        ),
        {correlationId: payload.correlationId},
      );

      channel.ack(msg);
      console.log("✅ category checked");
    } catch (error) {
      console.error("❌ Failed to check category", error);
      channel.nack(msg, false, false); // reject message
    }
  });
};
