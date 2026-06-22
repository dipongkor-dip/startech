import ProductDetails from "@/components/product/ProductDetails";

type Props = {
  params: Promise<{slug?: string[]}>;
};

export default async function CategoryPage({params}: Props) {
  // ১. প্যারামস প্রমিজ await করা
  const {slug} = await params;

  // ২. সেফটি চেক: স্লাগ যদি অ্যারে হয় এবং তাতে পর্যাপ্ত ডাটা থাকে
  const slugArray = Array.isArray(slug) ? slug : [];

  // ৩. অ্যারের শেষ থেকে ২ নম্বর এবং ১ নম্বর এলিমেন্টটি তুলে আনা
  const categorySlug = slugArray[slugArray.length - 2] ?? null; // "samsung"
  const productModel = slugArray[slugArray.length - 1] ?? null; // "s24-ultra"

  return <ProductDetails slug={categorySlug} model={productModel} />;
}
