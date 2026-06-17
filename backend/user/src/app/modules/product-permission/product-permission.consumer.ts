import amqp from "amqplib";
import {prisma} from "../../config/database";
/**
 * Listener for category_check queue
 */
export const productPermissionCheckListener = (channel: amqp.Channel) => {
  channel.consume("product_permission", async (msg: any) => {
    if (!msg) return;

    try {
      const {permissionId, userId, correlationId} = JSON.parse(msg.content.toString());

      const productManager = await prisma.productManager.findUniqueOrThrow({where: {userId}, select: {id: true}});

      const permission = await prisma.productPermission.findUniqueOrThrow({
        where: {id: permissionId, productManagerId: productManager.id},
        select: {id: true, productManagerId: true},
      });

      channel.sendToQueue("product_per_response", Buffer.from(JSON.stringify({permissionId: permission.id, success: !!permission})), {correlationId});

      channel.ack(msg);
      console.log("✅ Product manager checked");
    } catch (error: any) {
      console.error("❌ Failed to check product manager auth", error);
      channel.nack(msg, false, false); // reject message

      const correlationId = msg.properties.correlationId;
      channel.sendToQueue("product_per_response", Buffer.from(JSON.stringify({success: false, error: error.message})), {correlationId});
    }
  });
};
