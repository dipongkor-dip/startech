import {Query} from "./query.model";

export const getQueriesByProductId = async (productId: string) => {
  const queries = await Query.find({productId}).sort({createdAt: -1}).lean();
  return {queries, totalQueries: queries.length};
};

export const createQuery = async (data: {
  productId: string;
  userId: string;
  name: string;
  question: string;
}) => {
  return Query.create(data);
};

export const answerQuery = async (queryId: string, answer: string) => {
  return Query.findByIdAndUpdate(queryId, {answer}, {new: true}).lean();
};

export const queryService = {getQueriesByProductId, createQuery, answerQuery};
