"use client";

import * as React from "react";
import Link from "next/link";
import {useRouter, useSearchParams} from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Checkbox} from "@/components/ui/checkbox";
import {Slider} from "@/components/ui/slider";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Badge} from "@/components/ui/badge";
import type {MockProduct} from "@/lib/category-listing";
import type {PcBuilderSlot} from "@/lib/pc-builder-data";
import {getFilterGroupsForSlot} from "@/lib/pc-builder-data";
import {usePcBuilder} from "@/components/pc-builder/PcBuilderContext";
import {HomeIcon, PackageIcon, Search} from "lucide-react";

function formatBdt(n: number) {
  return `৳${n.toLocaleString("en-BD")}`;
}

type Props = {
  slot: PcBuilderSlot;
  products: MockProduct[];
};

export function PcComponentChooseView({slot, products: initialProducts}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {setLineProduct, linesBySlot} = usePcBuilder();

  const targetLineId = React.useMemo(() => {
    const lines = linesBySlot[slot.slug] ?? [];
    const param = searchParams.get("line");
    if (param && lines.some((l) => l.id === param)) return param;
    const empty = lines.find((l) => !l.product);
    return empty?.id ?? lines[0]?.id ?? "";
  }, [searchParams, linesBySlot, slot.slug]);
  const [search, setSearch] = React.useState("");
  const [sort, setSort] = React.useState<string>("asc");

  const maxPrice = React.useMemo(() => {
    const m = Math.max(1, ...initialProducts.map((p) => p.price));
    return Math.ceil(m / 1000) * 1000;
  }, [initialProducts]);

  const [priceRange, setPriceRange] = React.useState<[number, number]>(() => [0, maxPrice]);

  React.useEffect(() => {
    setPriceRange([0, maxPrice]);
  }, [maxPrice]);

  const filterGroups = React.useMemo(() => getFilterGroupsForSlot(slot), [slot]);

  const [checked, setChecked] = React.useState<Record<string, boolean>>({});

  const toggleFilter = (groupId: string, optionId: string, checkedNext: boolean) => {
    const key = `${groupId}:${optionId}`;
    setChecked((prev) => {
      const next = {...prev};
      if (checkedNext) next[key] = true;
      else delete next[key];
      return next;
    });
  };

  const filteredSorted = React.useMemo(() => {
    let list = [...initialProducts];
    list = list.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q) || p.specs.some((s) => s.toLowerCase().includes(q)));
    }
    const activePerGroup = filterGroups.map((g) => ({
      id: g.id,
      active: g.options.filter((o) => checked[`${g.id}:${o.id}`]).map((o) => o.label.toLowerCase()),
    }));
    for (const {active} of activePerGroup) {
      if (active.length === 0) continue;
      list = list.filter((p) => {
        const blob = `${p.title} ${p.specs.join(" ")}`.toLowerCase();
        return active.some((a) => blob.includes(a.replace(/\s+/g, " ")));
      });
    }
    if (sort === "asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [initialProducts, priceRange, search, checked, filterGroups, sort]);

  const pageTitle = `Choose ${slot.chooseTitle}`;

  const handleAdd = (product: MockProduct) => {
    if (!targetLineId) return;
    setLineProduct(slot.slug, targetLineId, product);
    router.push("/pc-builder");
  };

  return (
    <div className="flex flex-1 flex-col bg-muted/30">
      <div className="border-b bg-background">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/" className="inline-flex items-center gap-1" />}>
                  <HomeIcon className="size-4" />
                  <span className="sr-only">Home</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/pc-builder" />}>PC Builder</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <h1 className="mb-6 text-xl font-semibold text-chart-1 md:text-2xl">{pageTitle}</h1>

        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
          <aside className="w-full shrink-0 space-y-6 lg:w-64">
            <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-foreground">Price Range</h2>
              <div className="mt-4 px-1">
                <Slider
                  min={0}
                  max={maxPrice}
                  value={priceRange}
                  onValueChange={(v) => {
                    if (Array.isArray(v) && v.length >= 2) setPriceRange([v[0], v[1]]);
                  }}
                />
              </div>
              <div className="mt-3 flex gap-2">
                <Input
                  type="number"
                  className="h-8 text-xs"
                  value={priceRange[0]}
                  min={0}
                  onChange={(e) => {
                    const n = Number(e.target.value);
                    if (Number.isNaN(n)) return;
                    setPriceRange([Math.min(Math.max(0, n), priceRange[1]), priceRange[1]]);
                  }}
                />
                <Input
                  type="number"
                  className="h-8 text-xs"
                  value={priceRange[1]}
                  max={maxPrice}
                  onChange={(e) => {
                    const n = Number(e.target.value);
                    if (Number.isNaN(n)) return;
                    setPriceRange([priceRange[0], Math.max(priceRange[0], Math.min(n, maxPrice))]);
                  }}
                />
              </div>
            </div>

            {filterGroups.map((group) => (
              <div key={group.id} className="rounded-lg border border-border bg-card p-4 shadow-sm">
                <h2 className="text-sm font-semibold text-foreground">{group.label}</h2>
                <ul className="mt-3 max-h-48 space-y-2 overflow-y-auto pr-1 text-sm">
                  {group.options.map((opt) => {
                    const key = `${group.id}:${opt.id}`;
                    return (
                      <li key={opt.id} className="flex items-start gap-2">
                        <Checkbox
                          id={key}
                          checked={!!checked[key]}
                          onCheckedChange={(v) => toggleFilter(group.id, opt.id, v === true)}
                          className="mt-0.5"
                        />
                        <Label htmlFor={key} className="cursor-pointer font-normal leading-snug">
                          {opt.label}
                        </Label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </aside>

          <div className="min-w-0 flex-1 space-y-4">
            <div className="flex flex-col gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="relative max-w-md flex-1">
                <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search in this category..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 pl-9"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort</span>
                <Select value={sort} onValueChange={(v) => v && setSort(v)}>
                  <SelectTrigger size="sm" className="min-w-[11rem]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="asc">Price (Low &gt; High)</SelectItem>
                    <SelectItem value="desc">Price (High &lt; Low)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <ul className="space-y-3">
              {filteredSorted.length === 0 ? (
                <li className="rounded-lg border border-dashed border-border bg-card py-16 text-center text-sm text-muted-foreground">
                  No products match your filters.
                </li>
              ) : (
                filteredSorted.map((product) => (
                  <li
                    key={product.id}
                    className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-stretch"
                  >
                    <div className="relative shrink-0">
                      {product.discountLabel ? (
                        <Badge className="absolute left-0 top-0 z-10 bg-violet-600 text-white hover:bg-violet-600">{product.discountLabel}</Badge>
                      ) : null}
                      <div className="flex size-28 items-center justify-center rounded-md bg-muted/70 sm:size-32">
                        <PackageIcon className="size-14 text-muted-foreground/60" aria-hidden />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-heading text-sm font-semibold leading-snug text-foreground">{product.title}</p>
                      <ul className="mt-2 list-inside list-disc space-y-0.5 text-xs text-muted-foreground">
                        {product.specs.map((s) => (
                          <li key={s}>{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex shrink-0 flex-row items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center">
                      <div className="text-left sm:text-right">
                        <p className="text-lg font-bold text-chart-1">{formatBdt(product.price)}</p>
                        {product.originalPrice ? (
                          <p className="text-sm text-muted-foreground line-through">{formatBdt(product.originalPrice)}</p>
                        ) : null}
                      </div>
                      <Button
                        type="button"
                        className="bg-chart-1 text-primary-foreground hover:bg-chart-1/90"
                        onClick={() => handleAdd(product)}
                      >
                        Add
                      </Button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
