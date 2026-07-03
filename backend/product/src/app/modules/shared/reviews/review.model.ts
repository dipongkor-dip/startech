import mongoose, {Schema} from "mongoose";
import {IReview} from "./review.interface";

const ReviewSchema = new Schema<IReview>(
  {
    productId: {type: Schema.Types.ObjectId, ref: "Phone", required: true},
    userId: {type: Schema.Types.ObjectId, ref: "User", required: true},
    rating: {type: Number, required: true, min: 1, max: 5},
    comment: {type: String, required: true, trim: true},
  },
  {timestamps: true, versionKey: false},
);

export const Review = mongoose.model<IReview>("Review", ReviewSchema);
