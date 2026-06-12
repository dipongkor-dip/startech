import mongoose, {Schema} from "mongoose";
import {CategoryInt} from "./categories.interface";

const categorySchema = new Schema<CategoryInt>(
  {
    name: {type: String, required: true, trim: true},
    description: {type: String, unique: true, default: null},
    parentId: {type: Schema.Types.ObjectId, ref: "Category", default: null},
    isActive: {type: Boolean, default: true},

    // Optional: keep direct children references for faster lookup
    children: [{type: Schema.Types.ObjectId, ref: "Category"}],
    autoNumber: {type: Number, default: null}, // for sorting categories
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
    versionKey: false, // removes __v
  },
);

export const updateCategorySchema = new Schema<CategoryInt>(
  {
    name: {type: String, required: true, trim: true},
    description: {type: String, unique: true, default: null},
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
    versionKey: false, // removes __v
  },
);

export const category = mongoose.model<CategoryInt>("Category", categorySchema);
