import mongoose from "mongoose";

import ServerError from "../../../handler/ServerError";
import status from "http-status";
import {Phone} from "../../phones/phone.model";
import { category } from "../categories/categories.model";

type CategoryTree = {
  slug: string;
  child: CategoryTree[];
};

const getAllCategories = async (parentId: mongoose.Types.ObjectId | string | null): Promise<CategoryTree[]> => {
  const nodes = await category
    .find({parentId: parentId ?? null})
    .select("slug name")
    .sort({autoNumber: 1, createdAt: 1})
    .lean()
    .exec();

  return Promise.all(
    nodes.map(async (node: any) => {
      const children = await getAllCategories(node._id);
      return {slug: node.slug, name: node.name, child: children};
    }),
  );
};

export const getProductsService = async (filters: any) => {
  const {slug, page = 1, limit = 16, sortBy = "default", price, availability} = filters;
  const skip = (Number(page) - 1) * limit;
  const {0: minPrice, 1: maxPrice} = price.split(",");
  console.log(filters, minPrice, maxPrice);

  const c = await category.findOne({slug: slug}).select("_id").lean().exec();
  if (!c) throw new ServerError(status.NOT_FOUND, "Not Found Category");

  const nodes = await getAllCategories(c._id);

  const eachCategoryLimit = nodes.length >= limit ? limit / nodes.length : limit;
  const childHas = nodes.length > 0 ? true : false;

  if (!childHas) {
    console.log("child", childHas, eachCategoryLimit);
  }

  const totalProducts = await Phone.countDocuments();

  const metaData = {total: totalProducts, page: Number(page), limit: Number(limit)};

  return {products: nodes, metaData};
};
