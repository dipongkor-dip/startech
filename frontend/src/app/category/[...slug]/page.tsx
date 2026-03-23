import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CategoryListingView } from '@/components/category/CategoryListingView';
import {
  getMockProducts,
  mapPhonesToMockProducts,
  resolveCategoryListing,
} from '@/lib/category-listing';
import { getPhones } from '@/lib/productApi';

type Props = { params: Promise<{ slug?: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const listing = resolveCategoryListing(slug);
  if (!listing) return { title: 'Category | Star Tech' };
  return {
    title: `${listing.title} | Star Tech`,
    description: listing.description,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const listing = resolveCategoryListing(slug);
  if (!listing) notFound();

  // Your product microservice currently exposes `/api/v1/phones`.
  // Until you add dedicated category endpoints, we map phone data into the
  // existing category listing card model.
  let products = getMockProducts();
  try {
    const phones = (await getPhones()) as unknown as Parameters<
      typeof mapPhonesToMockProducts
    >[0];
    products = mapPhonesToMockProducts(phones);
  } catch {
    // Keep the UI functional even if the API is temporarily unavailable.
    products = getMockProducts();
  }

  return <CategoryListingView listing={listing} products={products} />;
}
