type SearchValue = string | string[] | undefined;
type SearchParamsRecord = Record<string, SearchValue>;

const PRODUCT_API =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_PRODUCT_API || "http://localhost:3004")
    : process.env.PRODUCT_API || "http://product:3004";

export class CategoryApiResolver {
  private static readonly STATUS_PARAM = "filter_status";

  private static normalizeValue(value: SearchValue): string | null {
    if (Array.isArray(value)) return value[0] ?? null;
    return value ?? null;
  }

  static buildEndpoint(pathname: string, searchParams?: SearchParamsRecord): string {
    const cleanPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
    const query = new URLSearchParams();

    if (searchParams) {
      Object.entries(searchParams).forEach(([key, raw]) => {
        const value = this.normalizeValue(raw);
        if (!value) return;

        if (key === this.STATUS_PARAM) {
          query.set("status", value);
        } else {
          query.set(key, value);
        }
      });
    }

    const queryString = query.toString();
    return `${PRODUCT_API}/api/v1${cleanPath}${queryString ? `?${queryString}` : ""}`;
  }
}

export async function fetchCategoryProducts(pathname: string, searchParams?: SearchParamsRecord) {
  const endpoint = CategoryApiResolver.buildEndpoint(pathname, searchParams);
  const res = await fetch(endpoint, {cache: "no-store"});
  if (!res.ok) throw new Error("Failed to fetch category products");
  const json = await res.json();
  if (Array.isArray(json?.data)) return json.data;
  if (Array.isArray(json)) return json;
  return [];
}
