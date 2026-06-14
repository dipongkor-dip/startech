import mongoose, {Schema} from "mongoose";
import {CategoryInt} from "./categories.interface";

const categorySchema = new Schema<CategoryInt>(
  {
    name: {type: String, required: true, trim: true},
    slug: {type: String, required: true, unique: true},
    title: {type: String, default: null},
    description: {type: String, default: null},
    parentId: {type: Schema.Types.ObjectId, ref: "Category", default: null},
    isActive: {type: Boolean, default: true},

    autoNumber: {type: Number, default: null}, // for sorting categories
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
    versionKey: false, // removes __v
  },
);

// Compound unique index: name + parentId must be unique together
categorySchema.index({name: 1, parentId: 1}, {unique: true});

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
