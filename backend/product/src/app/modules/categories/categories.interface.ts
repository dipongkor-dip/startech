import mongoose, {ObjectId} from "mongoose";

export interface CategoryInt {
  name: string;
  title?: string;
  description?: string;
  parentId?: mongoose.Types.ObjectId | null;
  children?: mongoose.Types.ObjectId[];
  autoNumber?: number;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
