import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {CategoryListingView} from "@/components/category/CategoryListingView";
import {getMockProducts, mapPhonesToMockProducts, resolveCategoryListing} from "@/lib/category-listing";
import {getPhones} from "@/lib/productApi";

type Props = {params: Promise<{slug?: string[]}>; category: string};

export async function generateCategoryMetadata({params, category}: Props & {category: string}): Promise<Metadata> {
  const {slug} = await params;
  const categorySlug = slug ? [category, ...slug] : [category];
  const listing = resolveCategoryListing(categorySlug);
  if (!listing) return {title: `${category} | Star Tech`};
  return {
    title: `${listing.title} | Star Tech`,
    description: listing.description,
  };
}

export default async function CategoryPage({params, category}: Props & {category: string}) {
  const {slug} = await params;
  const categorySlug = slug ? [category, ...slug] : [category];
  const listing = resolveCategoryListing(categorySlug);
  if (!listing) notFound();

  let products = getMockProducts();
  try {
    const phones = (await getPhones()) as unknown as Parameters<typeof mapPhonesToMockProducts>[0];
    products = mapPhonesToMockProducts(phones);
  } catch {
    products = getMockProducts();
  }

  return <CategoryListingView listing={listing} products={products} />;
}