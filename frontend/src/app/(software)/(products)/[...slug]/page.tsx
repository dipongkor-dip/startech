import DemoCategoryListingView from "@/components/DemoCategoryListingView";

type Props = {
  params: Promise<{slug?: string[]}>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CategoryPage({params, searchParams}: Props) {
  const {slug} = await params;
  const categorySlug = slug?.slice(-1)[0] ?? null;
  const query = searchParams ? await searchParams : {};

  return <DemoCategoryListingView slug={categorySlug} query={query} />;
}
