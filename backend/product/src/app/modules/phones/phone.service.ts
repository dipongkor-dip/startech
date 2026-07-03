import {Phone} from "./phone.model";
import {IPhone} from "./phone.interface";
import {sendRpcMessage} from "../../config/rabbitmq";
import ServerError from "../../handler/ServerError";
import status from "http-status";
import mongoose, {ObjectId} from "mongoose";
import {Product} from "../shared/products/products.model";
import {ProductInt, ProductModelName, ProductStatus} from "../shared/products/products.interface";
import {Description} from "../shared/description/description.model";
import {IDescription} from "../shared/description/description.interface";
import {uploadFilesToCloudinary} from "../../config/cloudinary";

const getPhones = async () => {
  const phones = await Phone.find({productStatus: ProductStatus.ACTIVE}).sort({createdAt: -1}).lean();
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

export const createPhone = async (
  productData: any,
  phoneData: any,
  descriptionData: any,
  phoneImages: {url: string; publicId: string}[], // 🎯 ফোনের ইমেজ
  descImages: {url: string; publicId: string}[], // 🎯 ডেসক্রিপশনের ইমেজ
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // 🎯 ১. যার যার কালেকশনের ইমেজ তার তার অবজেক্টে সেট করা হলো
    phoneData.images = phoneImages;
    descriptionData.images = descImages;

    // ২. ফোন ডকুমেন্ট তৈরি ও সেভ
    const phn = new Phone(phoneData);
    await phn.save({session});

    // ৩. ডেসক্রিপশন ডকুমেন্ট তৈরি ও সেভ
    const des = new Description(descriptionData);
    await des.save({session});

    // ৪. প্রোডাক্ট রিলেশন ও সেভ
    productData.specificationModel = "Phone";
    productData.productId = phn._id;

    const prd = new Product(productData);
    await prd.save({session});

    await session.commitTransaction();
    return prd;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
  }
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

  const updatePhone = await Phone.findByIdAndUpdate(id, data as Record<string, unknown>, {
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

const getProductManagerPhones = async (userId: string, categoryId: string) => {
  const response = await sendRpcMessage<{success: boolean; permissionId: string; error?: string}>("product_permission", "product_per_response", {categoryId, userId});

  if (!response.success || !response.permissionId) {
    throw new ServerError(status.UNAUTHORIZED, response.error || "Unauthorized User");
  }

  const phones = await Phone.find({
    permissionId: response.permissionId,
    productStatus: {$in: [ProductStatus.ACTIVE, ProductStatus.INACTIVE]},
  })
    .sort({createdAt: -1})
    .lean();

  return phones;
};

export const phoneService = {
  getPhones,
  getPhoneById,
  createPhone,
  updatePhone,
  deletePhone,
  getProductManagerPhones,
};
