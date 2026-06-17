import React from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

const ProductsHeader = ({categoryName}: {categoryName: string}) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sortBy, setSortBy] = React.useState<string>(searchParams.get("sortBy") || "default");
  const [pageSize, setPageSize] = React.useState<string>(searchParams.get("limit") || "16");

  return (
    <div className="flex flex-col gap-3 rounded border border-border bg-card px-4 py-3 shadow-sm shadow-sidebar-border sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-sm font-semibold text-foreground">{categoryName}</h2>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Show</span>
          <Select
            value={pageSize}
            onValueChange={(v) => {
              if (v) {
                setPageSize(v);
                const newSearchParams = new URLSearchParams(searchParams.toString());
                newSearchParams.set("limit", v);
                router.push(`${pathname}?${newSearchParams.toString()}`);
              }
            }}
          >
            <SelectTrigger size="sm" className="min-w-[5rem] border-none bg-background rounded-none ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-none border-none bg-card">
              <SelectItem value="16" className="hover:bg-blue-600 hover:text-white">
                16
              </SelectItem>
              <SelectItem value="26" className="hover:bg-blue-600 hover:text-white">
                26
              </SelectItem>
              <SelectItem value="32" className="hover:bg-blue-600 hover:text-white">
                32
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort By</span>
          <Select
            value={sortBy}
            onValueChange={(v) => {
              if (v) {
                setSortBy(v);
                const newSearchParams = new URLSearchParams(searchParams.toString());
                // keep existing limit and page values in URL; only update sortBy
                newSearchParams.set("sortBy", v);
                router.push(`${pathname}?${newSearchParams.toString()}`);
              }
            }}
          >
            <SelectTrigger size="sm" className="min-w-[10rem] border-none bg-background ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-none">
              <SelectItem value="default" className="hover:bg-blue-600 hover:text-white">
                Default
              </SelectItem>
              <SelectItem value="asc" className="hover:bg-blue-600 hover:text-white">
                Price (Low &gt; High)
              </SelectItem>
              <SelectItem value="desc" className="hover:bg-blue-600 hover:text-white">
                Price (High &lt; Low)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ProductsHeader;
