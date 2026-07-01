import mongoose from "mongoose";

export interface CategoryInt {
  id?: string;
  name: string;
  slug: string;
  title?: string;
  description?: string;
  parentId?: mongoose.Types.ObjectId | string | null;
  children?: mongoose.Types.ObjectId[];
  autoNumber?: number | null;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
