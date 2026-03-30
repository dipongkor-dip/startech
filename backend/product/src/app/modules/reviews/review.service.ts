import {Review} from "./review.model";

export const getReviewsByProductId = async (productId: string) => {
  const reviews = await Review.find({productId}).sort({createdAt: -1}).lean();
  const total = reviews.length;
  const averageRating =
    total > 0 ? reviews.reduce((acc: number, r: {rating?: number}) => acc + (r.rating || 0), 0) / total : 0;
  return {reviews, totalReviews: total, averageRating: Math.round(averageRating * 10) / 10};
};

export const createReview = async (data: {productId: string; userId: string; rating: number; comment: string}) => {
  return Review.create(data);
};

export const reviewService = {getReviewsByProductId, createReview};
