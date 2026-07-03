import mongoose, {Schema} from "mongoose";
import {IQuery} from "./query.interface";

const QuerySchema = new Schema<IQuery>(
  {
    productId: {type: Schema.Types.ObjectId, ref: "Phone", required: true},
    userId: {type: Schema.Types.ObjectId, ref: "User", required: true}, 
    question: {type: String, required: true, trim: true},
    answer: {type: String, default: ""},
  },
  {timestamps: true},
);

export const Query = mongoose.model<IQuery>("Query", QuerySchema);
