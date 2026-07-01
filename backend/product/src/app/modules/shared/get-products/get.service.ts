import mongoose, {Model} from "mongoose";
import ServerError from "../../../handler/ServerError";
import status from "http-status";
import {category} from "../categories/categories.model";

// ১. টাইপস্ক্রিপ্টের জন্য নতুন মিনিমাল ইন্টারফেস (নামের প্রোপার্টি বাদ দেওয়া হয়েছে)
interface CategoryDataResult {
  parentId: mongoose.Types.ObjectId;
  subCategoryIds: mongoose.Types.ObjectId[];
  allIds: mongoose.Types.ObjectId[];
}

const getCategoryAndSubCategoryIds = async (slug: string): Promise<CategoryDataResult> => {
  if (!slug) throw new ServerError(status.NOT_FOUND, "Category ID not provided");

  // শুধুমাত্র _id সিলেক্ট করা হচ্ছে, name ফিল্ড আনার দরকার নেই
  const targetCategory = await category.findOne({slug, isActive: true}).select("_id").lean().exec();
  if (!targetCategory) throw new ServerError(status.NOT_FOUND, "Category Not Found");

  const parentId = new mongoose.Types.ObjectId(targetCategory._id.toString());

  // সাব-ক্যাটাগরির ক্ষেত্রেও শুধু _id তুলে আনা হচ্ছে
  const subCategories = await category.find({parentId: parentId, isActive: true}).select("_id").lean().exec();

  const subCategoryIds = subCategories.map((cat) => new mongoose.Types.ObjectId(cat._id.toString()));

  return {
    parentId,
    subCategoryIds,
    allIds: [parentId, ...subCategoryIds],
  };
};

const skipModelNames = new Set(["Category", "Description", "Review", "Query", "User", "Order"]);

const findModelsWithCategory = async (targetCategoryIds: mongoose.Types.ObjectId[], customSkipModelNames: string[] = []): Promise<string[]> => {
  const skipNames = new Set([...skipModelNames, ...customSkipModelNames]);
  const registeredModels = mongoose.modelNames().filter((modelName) => !skipNames.has(modelName));

  const matchedModels: string[] = [];

  await Promise.all(
    registeredModels.map(async (modelName) => {
      const Model = mongoose.models[modelName] as Model<any> | undefined;
      if (!Model) return;

      const exists = await Model.exists({categoryId: {$in: targetCategoryIds}});
      if (exists) {
        matchedModels.push(modelName);
      }
    }),
  );

  return matchedModels;
};

// মেইন সার্ভিস ফাংশন
export const getProductsService = async (filters: any) => {
  const {slug, page = 1, limit = 16, sortBy = "default", price, availability} = filters;

  const currentPage = Math.max(1, Number(page));
  const currentLimit = Math.max(1, Number(limit));

  // параллельно ক্যাটাগরি ডাটা ফেচিং
  const categoryData = await getCategoryAndSubCategoryIds(slug);
  const activeModels = await findModelsWithCategory(categoryData.allIds);

  if (activeModels.length === 0) {
    return {products: [], metaData: {total: 0, page: currentPage, limit: currentLimit, totalPages: 0}};
  }

  // প্রতিটি model-এর জন্য লিমিট বণ্টন
  const modelLimit = Math.max(1, Math.floor(currentLimit / activeModels.length));

  // ডাইনামিক কুয়েরি ফিল্টার বিল্ডার
  const baseQuery: any = {};

  // প্রাইস ফিল্টারে স্ট্রিং ভ্যালিডেশন চেক
  if (price && typeof price === "string" && price.includes(",")) {
    const [minPrice, maxPrice] = price.split(",").map(Number);
    baseQuery.price = {};
    if (!isNaN(minPrice)) baseQuery.price.$gte = minPrice;
    if (!isNaN(maxPrice)) baseQuery.price.$lte = maxPrice;
  }

  if (availability && typeof availability === "string" && availability.trim() !== "") {
    const availabilityMap: Record<string, string> = {
      in: "In Stock",
      up: "Coming Soon",
      pre: "Pre Order",
      out: "Out of Stock",
    };

    const mappedAvailability = availability
      .split(",")
      .map((key) => availabilityMap[key.trim()])
      .filter(Boolean);

    if (mappedAvailability.length > 0) {
      baseQuery.availability = {$in: mappedAvailability};
    }
  }

  // সর্টিং কনফিগারেশন
  let sortOptions: any = {createdAt: -1};
  if (sortBy === "asc") sortOptions = {price: 1};
  if (sortBy === "desc") sortOptions = {price: -1};

  // ক্লিন প্রোজেকশন ফিল্ডস
  const selectedFields = {
    model: 1,
    price: 1,
    discountPrice: 1,
    images: 1,
    availability: 1,
    display: 1,
    processor: 1,
    camera: 1,
    features: 1,
    categoryId: 1,
    createdAt: 1,
    _id: 1,
  };

  let finalProducts: any[] = [];
  let totalCount = 0;

  // ৫. প্রতিটি model থেকে ডাটা ফেচ করা
  const modelResults = await Promise.all(
    activeModels.map(async (modelName) => {
      const Model = mongoose.models[modelName] as Model<any> | undefined;
      if (!Model) return {products: [], count: 0};

      const countPromise = Model.countDocuments({
        ...baseQuery,
        categoryId: {$in: categoryData.allIds},
      });

      let dataPromise;
      if (categoryData.subCategoryIds.length >= 2) {
        const subCategoryLimit = Math.max(1, Math.floor(modelLimit / categoryData.subCategoryIds.length));
        const subCategorySkip = (currentPage - 1) * subCategoryLimit;

        const subCategoryPromises = categoryData.subCategoryIds.map(async (subId) => {
          return Model.find({...baseQuery, categoryId: subId}, selectedFields)
            .sort(sortOptions)
            .skip(subCategorySkip)
            .limit(subCategoryLimit)
            .lean();
        });
        dataPromise = Promise.all(subCategoryPromises).then((results) => results.flat());
      } else {
        const globalSkip = (currentPage - 1) * modelLimit;
        dataPromise = Model.find({...baseQuery, categoryId: {$in: categoryData.allIds}}, selectedFields)
          .sort(sortOptions)
          .skip(globalSkip)
          .limit(modelLimit)
          .lean();
      }

      // ডাটা ও কাউন্ট একসাথে প্যারালালি ফেচ হবে
      const [products, count] = await Promise.all([dataPromise, countPromise]);

      return {products, count};
    }),
  );

  // রেজাল্ট কম্বাইন করা
  modelResults.forEach((result) => {
    if (result) {
      finalProducts.push(...result.products);
      totalCount += result.count;
    }
  });

  // মেমোরি সর্টিং
  if (sortBy === "asc") {
    finalProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (sortBy === "desc") {
    finalProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
  } else {
    finalProducts.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  return {
    products: finalProducts,
    metaData: {
      total: totalCount,
      page: currentPage,
      limit: currentLimit,
      totalPages: Math.ceil(totalCount / currentLimit),
    },
  };
};

export const getProductService = async (categorySlug: string, productModel: string) => {
  if (!categorySlug || !productModel) {
    throw new ServerError(status.BAD_REQUEST, "Category slug and Product model are required");
  }

  // ১. স্লাগ দিয়ে নির্দিষ্ট ক্যাটাগরি খুঁজে বের করা
  const cat = await category.findOne({slug: categorySlug, isActive: true}).select("_id").lean().exec();
  if (!cat) {
    throw new ServerError(status.NOT_FOUND, "Category Not Found");
  }

  const targetCategoryId = new mongoose.Types.ObjectId(cat._id.toString());

  // ২. রেজিস্টার করা product model গুলো থেকে এই ক্যাটাগরির model খুঁজে বের করা
  const activeModels = await findModelsWithCategory([targetCategoryId]);

  let matchedModel: Model<any> | null = null;

  // ৩. লুপ চালিয়ে শুধুমাত্র এই ক্যাটাগরির product model কোনটি তা খুঁজে বের করা
  for (const modelName of activeModels) {
    const Model = mongoose.models[modelName] as Model<any> | undefined;
    if (!Model) continue;

    const exists = await Model.exists({categoryId: targetCategoryId});
    if (exists) {
      matchedModel = Model;
      break;
    }
  }

  if (!matchedModel) {
    throw new ServerError(status.NOT_FOUND, "No product model found for this category");
  }

  // 🎯 ফ্রন্টএন্ডের "samsung-s24-ultra" কে "samsung s24 ultra" তে রূপান্তর করা
  const formattedModelQuery = productModel.replace(/-/g, " ");

  // 🎯 মঙ্গোডিবির জন্য কেস-ইনসেনসিটিভ রেগুলার এক্সপ্রেশন তৈরি (i মানে Case-Insensitive)
  // এটি "samsung s24 ultra" দিয়ে ডাটাবেজের "Samsung S24 Ultra" কে নিখুঁতভাবে খুঁজে পাবে
  const modelRegex = new RegExp(`^${formattedModelQuery}$`, "i");

  const product = await matchedModel
    .findOne(
      {
        model: modelRegex, // 🎯 এখানে রেগুলার এক্সপ্রেশন পাস করা হলো
        categoryId: targetCategoryId,
      },
      {__v: 0},
    )
    .lean();

  if (!product) {
    throw new ServerError(status.NOT_FOUND, "Product Not Found");
  }

  return product;
};
