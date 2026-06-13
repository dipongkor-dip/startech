import status from "http-status";
import {prisma} from "../../config/database";
import ServerError from "../../handler/ServerError";
import {sendRpcMessage} from "../../config/rabbitmq";

export const createPermission = async (payload: {categoryId: string; productManagerId: string}, userId: string) => {
  const {categoryId, productManagerId} = payload;

  // ✅ Admin validation
  const admin = await prisma.admin.findUniqueOrThrow({where: {userId, isActive: true}, select: {id: true}});

  // ✅ Duplicate check
  const isExists = await prisma.productPermission.findUnique({where: {productManagerId_categoryId: {productManagerId, categoryId}}});
  if (isExists) throw new ServerError(status.FOUND, "Already permission exists for this user");

  // ✅ RPC call to category service
  const response = await sendRpcMessage<{exists: boolean}>("category_check", "category_response", payload);

  if (!response.exists) {
    throw new ServerError(status.NOT_FOUND, "❌ Category does not exist");
  }

  // ✅ Create permission

  return await prisma.productPermission.create({data: {productManagerId, categoryId, adminId: admin.id}});
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
