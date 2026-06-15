import mongoose from "mongoose";

export interface IReview {
    _id: mongoose.Types.ObjectId;
    productId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}