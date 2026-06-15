import mongoose from "mongoose";

export interface IQuery {
  _id?: mongoose.Types.ObjectId;
  name: string;
  productId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  question: string;
  answer?: string;
  createdAt: Date;
  updatedAt: Date;
}