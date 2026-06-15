import mongoose from "mongoose";

export interface CategoryInt {
  name: string;
  slug: string;
  title?: string;
  description?: string;
  parentId?: mongoose.Types.ObjectId | null;
  children?: mongoose.Types.ObjectId[];
  autoNumber?: number;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
