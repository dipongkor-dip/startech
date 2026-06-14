import mongoose from "mongoose";
import {category, updateCategorySchema} from "./categories.model";
import {CategoryInt} from "./categories.interface";
import ServerError from "../../handler/ServerError";
import {StatusCodes} from "http-status-codes";

type CategoryTree = {
  name: string;
  child: CategoryTree[];
};

const createCategory = async (data: Partial<CategoryInt>) => {
  const res = await category.create(data);
  const c = res.toObject() as unknown as Record<string, unknown>;
  return c;
};

const getAllCategories = async (parentId: string | null = null): Promise<CategoryTree[]> => {
  const nodes = await category
    .find({
      parentId: parentId ? new mongoose.Types.ObjectId(parentId) : null,
    })
    .select("name autoNumber createdAt isActive _id")
    .sort({autoNumber: 1, createdAt: 1}) // firstly sort by autoNumber, is autoNumber null then sort by createdAt
    .exec();
  return Promise.all(
    nodes.map(async (node) => {
      const children = await getAllCategories(node._id.toString());
      return {_id: node._id, name: node.name, isActive: node.isActive, autoNumber: node.autoNumber, child: children};
    }),
  );
};

const updateCategory = async (id: mongoose.Types.ObjectId, data: typeof updateCategorySchema) => {
  const res = await category.findByIdAndUpdate(id, data, {new: true}).select("name description createdAt updatedAt").exec();

  const c = res!.toObject() as unknown as Record<string, unknown>;
  return c;
};

const deleteCategory = async (id: string) => {
  await category.findByIdAndDelete(id).exec();
};

const updateStatus = async (id: string) => {
  const cat = await category.findById(id).exec();
  if (!cat) throw new ServerError(StatusCodes.NOT_FOUND, "Category not found");

  const isActive = !cat.isActive;
  const data = await category.findByIdAndUpdate(id, {isActive}).select("name isActive").exec();
  return data;
};

const updateSequence = async (payload: {id: mongoose.Types.ObjectId; autoNumber: number}[]) => {
  const promises = payload.map(({id, autoNumber}) => {
    return category.findByIdAndUpdate(id, {autoNumber}, {new: true}).select("name autoNumber createdAt updatedAt").exec();
  });
  const results = await Promise.all(promises);
  return results.map((res) => {
    const c = res!.toObject() as unknown as Record<string, unknown>;
    return c;
  });
};

const getCategoryById = async (id: string) => {
  const res = await category.findById(id, {isActive: true}).select("name description").exec();
  if (!res) throw new ServerError(StatusCodes.NOT_FOUND, "Category not found");
  const c = res.toObject() as unknown as Record<string, unknown>;
  return c;
};

export const categoryService = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  updateStatus,
  updateSequence,
  getCategoryById,
};
