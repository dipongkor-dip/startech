import {Phone} from "./phone.model";
import {IPhone} from "./phone.interface";
import {sendRpcMessage} from "../../config/rabbitmq";
import ServerError from "../../handler/ServerError";
import status from "http-status";
import {JwtPayload} from "jsonwebtoken";
import {ObjectId} from "mongoose";

// Map API field 'model' to schema field 'modelName'
const toSchemaData = (data: Record<string, unknown>) => {
  const {model, ...rest} = data;
  return model !== undefined ? {...rest, modelName: model} : rest;
};

const getPhones = async () => {
  const phones = await Phone.find().sort({createdAt: -1}).lean();
  return phones.map((p: Record<string, unknown>) => ({
    ...p,
    model: p.modelName ?? p.model,
    modelName: undefined,
  }));
};

const getPhoneById = async (id: string) => {
  const phone = await Phone.findById(id).lean();
  if (!phone) return null;
  const p = phone as Record<string, unknown>;
  return {...p, model: p.modelName ?? p.model, modelName: undefined};
};

const createPhone = async (data: Partial<IPhone>) => {
  const phone = await Phone.create(toSchemaData(data as Record<string, unknown>));
  const p = phone.toObject() as unknown as Record<string, unknown>;
  return {...p, model: p.modelName ?? p.model, modelName: undefined};
};

const updatePhone = async (id: string, data: Partial<IPhone>, userId: string) => {
  const phone = await Phone.findById(id).select({categoryId: true, permissionId: true}).lean<{categoryId: string | ObjectId; permissionId: string}>();

  if (!phone) throw new ServerError(status.NOT_FOUND, "Product not found");

  const response = await sendRpcMessage<{success: boolean; permissionId: string; error?: string}>("product_permission", "product_per_response", {
    categoryId: phone.categoryId,
    userId,
  });

  if (!response.success || response.permissionId !== phone.permissionId) {
    throw new ServerError(status.UNAUTHORIZED, response.error || "Unauthorized User");
  }

  const updatePhone = await Phone.findByIdAndUpdate(id, toSchemaData(data as Record<string, unknown>), {
    new: true,
  }).lean();
  if (!updatePhone) return null;
  const p = updatePhone as Record<string, unknown>;
  return {...p, model: p.modelName ?? p.model, modelName: undefined};
};

const deletePhone = async (id: string) => {
  const phone = await Phone.findByIdAndDelete(id).lean();
  if (!phone) return null;
  const p = phone as Record<string, unknown>;
  return {...p, model: p.modelName ?? p.model, modelName: undefined};
};

export const phoneService = {
  getPhones,
  getPhoneById,
  createPhone,
  updatePhone,
  deletePhone,
};
