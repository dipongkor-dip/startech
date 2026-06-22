import mongoose from "mongoose";
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

// ২. একটিভ কালেকশন খোঁজার ফাংশন
const findCollectionsWithCategory = async (targetCategoryIds: mongoose.Types.ObjectId[], customSkipCollections: string[] = []): Promise<string[]> => {
  if (!mongoose.connection.db) return [];

  const collections = await mongoose.connection.db.listCollections({}, {nameOnly: true}).toArray();
  const collectionNames = collections.map((col) => col.name);

  const skipCollections = new Set(["categories", "descriptions", "reviews", "queries", "users", "orders", ...customSkipCollections]);
  const targetCollections = collectionNames.filter((name) => !skipCollections.has(name));

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

// মেইন সার্ভিস ফাংশন
export const getProductsService = async (filters: any) => {
  const {slug, page = 1, limit = 16, sortBy = "default", price, availability} = filters;

  const currentPage = Math.max(1, Number(page));
  const currentLimit = Math.max(1, Number(limit));

  // параллельно ক্যাটাগরি ডাটা ফেচিং
  const categoryData = await getCategoryAndSubCategoryIds(slug);
  const activeCollections = await findCollectionsWithCategory(categoryData.allIds);

  if (activeCollections.length === 0) {
    return {products: [], metaData: {total: 0, page: currentPage, limit: currentLimit, totalPages: 0}};
  }

  // কালেকশন প্রতি লিমিট বণ্টন
  const collectionLimit = Math.max(1, Math.floor(currentLimit / activeCollections.length));

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
    projection: {
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
    },
  };

  let finalProducts: any[] = [];
  let totalCount = 0;

  // ৫. প্রতিটি কালেকশন থেকে ডাটা ফেচ করা
  const collectionResults = await Promise.all(
    activeCollections.map(async (colName) => {
      const collection = mongoose.connection.db?.collection(colName);
      if (!collection) return {products: [], count: 0};

      const countPromise = collection.countDocuments({
        ...baseQuery,
        categoryId: {$in: categoryData.allIds},
      });

      let dataPromise;
      if (categoryData.subCategoryIds.length >= 2) {
        const subCategoryLimit = Math.max(1, Math.floor(collectionLimit / categoryData.subCategoryIds.length));
        const subCategorySkip = (currentPage - 1) * subCategoryLimit;

        const subCategoryPromises = categoryData.subCategoryIds.map(async (subId) => {
          return collection
            .find({...baseQuery, categoryId: subId}, selectedFields)
            .sort(sortOptions)
            .skip(subCategorySkip)
            .limit(subCategoryLimit)
            .toArray();
        });
        dataPromise = Promise.all(subCategoryPromises).then((results) => results.flat());
      } else {
        const globalSkip = (currentPage - 1) * collectionLimit;
        dataPromise = collection
          .find({...baseQuery, categoryId: {$in: categoryData.allIds}}, selectedFields)
          .sort(sortOptions)
          .skip(globalSkip)
          .limit(collectionLimit)
          .toArray();
      }

      // ডাটা ও কাউন্ট একসাথে প্যারালালি ফেচ হবে
      const [products, count] = await Promise.all([dataPromise, countPromise]);

      return {products, count};
    }),
  );

  // রেজাল্ট কম্বাইন করা (কোনো কাস্টম লুপ বা নেম ম্যাপিং ছাড়াই সরাসরি পুশ)
  collectionResults.forEach((result) => {
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

  // ২. ডাটাবেজের কালেকশন লিস্ট থেকে কেবল নামগুলো নেওয়া
  if (!mongoose.connection.db) return null;
  const collections = await mongoose.connection.db.listCollections({}, {nameOnly: true}).toArray();
  const collectionNames = collections.map((col) => col.name);

  // বাদ দেওয়ার কালেকশন লিস্ট (Set ব্যবহার করা হয়েছে ফাস্টার চেকিংয়ের জন্য)
  const skipCollections = new Set(["categories", "descriptions", "reviews", "queries", "users", "orders"]);
  const targetCollections = collectionNames.filter((name) => !skipCollections.has(name));

  let matchedCollectionName: string | null = null;

  // ৩. লুপ চালিয়ে শুধুমাত্র এই ক্যাটাগরির "একমাত্র কালেকশন" কোনটি তা খুঁজে বের করা
  for (const colName of targetCollections) {
    const collection = mongoose.connection.db?.collection(colName);
    const exists = await collection?.findOne({categoryId: targetCategoryId}, {projection: {_id: 1}});

    if (exists) {
      matchedCollectionName = colName;
      break; // ক্যাটাগরির একমাত্র কালেকশনটি পাওয়ামাত্র লুপ বন্ধ (O(1) এর মতো কাজ করবে)
    }
  }

  if (!matchedCollectionName) {
    throw new ServerError(status.NOT_FOUND, "No collection found for this category");
  }

  // ৪. সরাসরি সেই নির্দিষ্ট কালেকশন থেকে মডেল এবং ক্যাটাগরি আইডি দিয়ে প্রোডাক্ট তুলে আনা
  const finalCollection = mongoose.connection.db.collection(matchedCollectionName);

  // 🎯 ফ্রন্টএন্ডের "samsung-s24-ultra" কে "samsung s24 ultra" তে রূপান্তর করা
  const formattedModelQuery = productModel.replace(/-/g, " ");

  // 🎯 মঙ্গোডিবির জন্য কেস-ইনসেনসিটিভ রেগুলার এক্সপ্রেশন তৈরি (i মানে Case-Insensitive)
  // এটি "samsung s24 ultra" দিয়ে ডাটাবেজের "Samsung S24 Ultra" কে নিখুঁতভাবে খুঁজে পাবে
  const modelRegex = new RegExp(`^${formattedModelQuery}$`, "i");

  const product = await finalCollection.findOne(
    {
      model: modelRegex, // 🎯 এখানে রেগুলার এক্সপ্রেশন পাস করা হলো
      categoryId: targetCategoryId,
    },
    {projection: {__v: 0}},
  );

  if (!product) {
    throw new ServerError(status.NOT_FOUND, "Product Not Found");
  }

  return product;
};
