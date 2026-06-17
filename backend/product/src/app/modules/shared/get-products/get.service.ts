import mongoose from "mongoose";
import ServerError from "../../../handler/ServerError";
import status from "http-status";
import {category} from "../categories/categories.model";

// ১. প্যারেন্ট ও সাব-ক্যাটাগরি আইডিগুলো নিশ্চিতভাবে ObjectId ফরম্যাটে নেওয়ার হেল্পার
const getCategoryAndSubCategoryIds = async (categorySlug: string) => {
  if (!categorySlug) throw new ServerError(status.NOT_FOUND, "Category slug Not Found");
  const allCategories = await category.find({isActive: true}).select("_id parentId slug").lean().exec();

  const targetCategory = allCategories.find((c) => c.slug === categorySlug);
  if (!targetCategory) throw new ServerError(status.NOT_FOUND, "Category Not Found");

  // নিশ্চিত করা হচ্ছে এগুলো যেন পিওর ObjectId হয়
  const parentId = new mongoose.Types.ObjectId(targetCategory._id.toString());
  const subCategoryIds: mongoose.Types.ObjectId[] = [];

  allCategories.forEach((cat) => {
    if (cat.parentId && cat.parentId.toString() === parentId.toString()) {
      subCategoryIds.push(new mongoose.Types.ObjectId(cat._id.toString()));
    }
  });

  return {
    parentId,
    subCategoryIds,
    allIds: [parentId, ...subCategoryIds],
  };
};

// একটিভ কালেকশন খোঁজার ফাংশন
const findCollectionsWithCategory = async (targetCategoryIds: mongoose.Types.ObjectId[], customSkipCollections: string[] = []) => {
  if (!mongoose.connection.db) return [];

  const collections = await mongoose.connection.db.listCollections().toArray();
  const collectionNames = collections.map((col) => col.name);

  const skipCollections = ["categories", "descriptions", "reviews", "queries", "users", "orders"];
  const finalExcludedCollections = [...skipCollections, ...customSkipCollections];

  const targetCollections = collectionNames.filter((name) => !finalExcludedCollections.includes(name));
  const collectionsFound: string[] = [];

  await Promise.all(
    targetCollections.map(async (colName) => {
      const collection = mongoose.connection.db?.collection(colName);
      const exists = await collection?.findOne({categoryId: {$in: targetCategoryIds}}, {projection: {_id: 1}});
      if (exists) {
        collectionsFound.push(colName);
      }
    }),
  );

  return collectionsFound;
};

// মেইন সার্ভিস ফাংশન
export const getProductsService = async (filters: any) => {
  const {slug, page = 1, limit = 16, sortBy = "default", price, availability} = filters;
  // console.log("availability", {availability}) // "in,up"
  console.log(filters);
  const currentPage = Math.max(1, Number(page));
  const currentLimit = Math.max(1, Number(limit));

  const categoryData = await getCategoryAndSubCategoryIds(slug);
  const skipCollections: string[] = [];
  // console.log("categoryData", categoryData.subCategoryIds)
  const activeCollections = await findCollectionsWithCategory(categoryData.allIds, skipCollections);

  if (activeCollections.length === 0) {
    return {products: [], metaData: {total: 0, page: currentPage, limit: currentLimit}};
  }

  // কালেকশন প্রতি লিমিট বণ্টন
  const collectionLimit = Math.max(1, Math.floor(currentLimit / activeCollections.length));

  // ডাইনামিক কুয়েরি ফিল্টার বিল্ডার
  const baseQuery: any = {};

  // প্রাইস ফিল্টারে স্ট্রিং ভ্যালিডেশন চেক
  if (price && typeof price === "string" && price.includes(",")) {
    const [minPrice, maxPrice] = price.split(",").map(Number);
    baseQuery.price = {};
    if (!isNaN(minPrice)) baseQuery.price.$gte = minPrice;
    if (!isNaN(maxPrice)) baseQuery.price.$lte = maxPrice;
  }

  if (availability && typeof availability === "string" && availability.trim() !== "") {
    baseQuery.availability = {$in: availability.split(",")};
  }

  // সর্টিং কনফিগারেশন
  let sortOptions: any = {createdAt: -1};
  if (sortBy === "asc") sortOptions = {price: 1};
  if (sortBy === "desc") sortOptions = {price: -1};

  let finalProducts: any[] = [];
  let totalCount = 0;

  // ৫. প্রতিটি কালেকশন থেকে ডাটা ফেচ করা (বিশুদ্ধ ফাংশনাল এবং রেস-কন্ডিশন মুক্ত লজিক)
  const collectionResults = await Promise.all(
    activeCollections.map(async (colName) => {
      const collection = mongoose.connection.db?.collection(colName);
      if (!collection) return {products: [], count: 0};

      let collectionProducts: any[] = [];
      const globalSkip = (currentPage - 1) * collectionLimit;

      // যদি ২ বা তার বেশি সাব-ক্যাটাগরি থাকে
      if (categoryData.subCategoryIds.length >= 2) {
        const subCategoryLimit = Math.max(1, Math.floor(collectionLimit / categoryData.subCategoryIds.length));
        const subCategorySkip = (currentPage - 1) * subCategoryLimit;

        const subCategoryPromises = categoryData.subCategoryIds.map(async (subId) => {
          return collection.find({categoryId: subId}).sort(sortOptions).skip(subCategorySkip).limit(subCategoryLimit).toArray();
        });
        console.log("subCategoryPromises", subCategoryPromises);

        const subCategoryResults = await Promise.all(subCategoryPromises);
        collectionProducts = subCategoryResults.flat();
      } else {
        // চাইল্ড না থাকলে প্যারেন্ট ও চাইল্ড এর আইডিগুলো দিয়ে কুয়েরি
        collectionProducts = await collection
          .find({categoryId: {$in: categoryData.allIds}})
          .sort(sortOptions)
          .skip(globalSkip)
          .limit(collectionLimit)
          .toArray();
      }

      // টোটাল কাউন্ট আলাদা কুয়েরি করা
      const count = await collection.countDocuments({
        categoryId: {$in: categoryData.allIds},
      });

      // ফর্ম্যাটেড প্রোডাক্ট তৈরি করা
      const formattedProducts = collectionProducts.map((p) => ({...p, collectionName: colName}));
      // বাইরের ভ্যারিয়েবলে পুশ না করে সরাসরি অবজেক্ট রিটার্ন করা হলো
      return {
        products: formattedProducts,
        count: count,
      };
    }),
  );

  collectionResults.forEach((result) => {
    if (result) {
      finalProducts.push(...result.products);
      totalCount += result.count;
    }
  });

  console.log("👉 Final Combined Products Length:", finalProducts.length);
  console.log("👉 Final Total Count:", totalCount);

  // মেমোরি সর্টিং
  if (sortBy === "asc") {
    finalProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (sortBy === "desc") {
    finalProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
  } else {
    finalProducts.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  const metaData = {
    total: totalCount,
    page: currentPage,
    limit: currentLimit,
    totalPages: Math.ceil(totalCount / currentLimit),
  };

  return {products: finalProducts, metaData};
};
