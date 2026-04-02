import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {CategoryListingView} from "@/components/category/CategoryListingView";
import {getMockProducts, mapPhonesToMockProducts, resolveCategoryListing} from "@/lib/category-listing";
import {fetchCategoryProducts} from "@/lib/category-api-resolver";

type Props = {
  params: Promise<{slug?: string[]}>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params;
  const listing = resolveCategoryListing(slug);
  if (!listing) return {title: "Category | Star Tech"};
  return {
    title: `${listing.title} | Star Tech`,
    description: listing.description,
  };
}

export default async function CategoryPage({params, searchParams}: Props) {
  const {slug} = await params;
  console.log("slug", slug);
  const query = searchParams ? await searchParams : {};
  const listing = resolveCategoryListing(slug);
  if (!listing) notFound();

  let products = getMockProducts();
  try {
    const phones = (await fetchCategoryProducts(listing.path, query)) as unknown as Parameters<typeof mapPhonesToMockProducts>[0];
    products = mapPhonesToMockProducts(phones);
  } catch {
    products = getMockProducts();
  }

  return <CategoryListingView listing={listing} products={products} />;
}