import {prisma} from "../config/database";
import {getChannel} from "../config/rabbitmq";

const createPermission = async (payload: {categoryId: string; productManagerId: string}, userId: string) => {
  const admin = await prisma.admin.findUniqueOrThrow({where: {userId, isActive: true, isVerified: true}, select: {id: true}});

  const channel = getChannel();

  await channel.assertQueue("category_check");
  await channel.assertQueue("category_response");

  channel.sendToQueue("category_check", Buffer.from(JSON.stringify(payload)));

  return new Promise((resolve, reject) => {
    channel.consume(
      "category_response",
      async (msg) => {
        if (!msg) return;
        const response = JSON.parse(msg.content.toString());

        if (response.exists) {
          const permission = await prisma.productPermission.create({data: {...payload, adminId: admin.id}});
          resolve(permission);

          channel.ack(msg);
        } else {
          reject(new Error("❌ Category does not exist"));
        }
      },
      {noAck: false},
    );
  });
};

const getPermissions = () => {
  // Logic to retrieve all permissions from the database
};

const updatePermission = (id: string, permission: string) => {
  // Logic to update an existing permission in the database
};

const deletePermission = (id: string) => {
  // Logic to delete a permission from the database
};

export const productPermissionService = {
  createPermission,
  getPermissions,
  updatePermission,
  deletePermission,
};
