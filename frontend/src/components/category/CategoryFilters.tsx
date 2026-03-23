"use client";

import * as React from "react";
import {useEffect} from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {Slider} from "@/components/ui/slider";
import {Input} from "@/components/ui/input";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";
import {cn} from "@/lib/utils";
import {filterOptions} from "@/data/sidebar-filters";

const PRICE_MAX = 953700;

const AVAILABILITY_STATUS = {
  inStock: "1",
  preOrder: "2",
  upcoming: "3",
} as const;

type FilterCheckboxProps = {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

function FilterRow({id, label, checked, onCheckedChange}: FilterCheckboxProps) {
  return (
    <div className="flex items-center gap-2 py-1">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className={`border-gray-400 rounded ${checked && "bg-blue-500 text-white font-bold"}`}
      />
      <Label htmlFor={id} className="cursor-pointer font-medium text-sm">
        {label}
      </Label>
    </div>
  );
}

export function CategoryFilters({className}: {className?: string}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [range, setRange] = React.useState<[number, number]>([0, PRICE_MAX]);

  const [availability, setAvailability] = React.useState({
    inStock: false,
    preOrder: false,
    upcoming: false,
  });

  const [processor, setProcessor] = React.useState({
    intel: false,
    amd: false,
    apple: false,
  });

  const [ram, setRam] = React.useState({
    gb8: false,
    gb16: false,
  });

  const [selectedFilters, setSelectedFilters] = React.useState<Record<string, Set<string>>>(() => {
    const initial: Record<string, Set<string>> = {};
    filterOptions.forEach((filter) => {
      initial[filter.title] = new Set();
    });
    return initial;
  });

  const setMin = (n: number) => {
    if (Number.isNaN(n)) return;
    const nextMin = Math.min(Math.max(0, n), range[1]);
    setRange([nextMin, range[1]]);
  };

  const setMax = (n: number) => {
    if (Number.isNaN(n)) return;
    const nextMax = Math.min(Math.max(range[0], n), PRICE_MAX);
    setRange([range[0], nextMax]);
  };

  const filterOptionQueryKey = (title: string) => title.toLowerCase().replace(/\s+/g, "_");

  const normalizeQueryValue = (filterTitle: string, rawValue: string) => {
    const filter = filterOptions.find((f) => f.title.toLowerCase() === filterTitle.toLowerCase());
    if (!filter) return rawValue;
    const matched = filter.i.find((option) => option.toLowerCase() === rawValue.toLowerCase());
    return matched ?? rawValue;
  };

  const applyAvailabilityQuery = (nextAvailability: {inStock: boolean; preOrder: boolean; upcoming: boolean}) => {
    const checkedStatus = Object.entries(nextAvailability)
      .filter(([, checked]) => checked)
      .map(([key]) => AVAILABILITY_STATUS[key as keyof typeof AVAILABILITY_STATUS]);

    const nextSearchParams = new URLSearchParams(searchParams.toString());
    if (checkedStatus.length) {
      nextSearchParams.set("filter_status", checkedStatus.join(","));
    } else {
      nextSearchParams.delete("filter_status");
    }

    filterOptions.forEach((filter) => {
      const key = filterOptionQueryKey(filter.title);
      const selected = selectedFilters[filter.title];
      if (selected && selected.size) {
        const values = Array.from(selected).map((value) => value.toLowerCase());
        nextSearchParams.set(key, values.join(","));
      } else {
        nextSearchParams.delete(key);
      }
    });

    const queryString = nextSearchParams.toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`, {scroll: false});
  };

  const applyFilterOptionsQuery = (nextSelectedFilters: Record<string, Set<string>>) => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());

    const checkedStatus = Object.entries(availability)
      .filter(([, checked]) => checked)
      .map(([key]) => AVAILABILITY_STATUS[key as keyof typeof AVAILABILITY_STATUS]);

    if (checkedStatus.length) {
      nextSearchParams.set("filter_status", checkedStatus.join(","));
    } else {
      nextSearchParams.delete("filter_status");
    }

    filterOptions.forEach((filter) => {
      const key = filterOptionQueryKey(filter.title);
      const selected = nextSelectedFilters[filter.title];
      if (selected && selected.size) {
        const values = Array.from(selected).map((value) => value.toLowerCase());
        nextSearchParams.set(key, values.join(","));
      } else {
        nextSearchParams.delete(key);
      }
    });

    const queryString = nextSearchParams.toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`, {scroll: false});
  };

  useEffect(() => {
    const raw = searchParams.get("filter_status");
    if (!raw) {
      setAvailability({inStock: false, preOrder: false, upcoming: false});
    } else {
      const parsed = new Set(raw.split(",").map((v) => v.trim()));
      setAvailability({
        inStock: parsed.has(AVAILABILITY_STATUS.inStock),
        preOrder: parsed.has(AVAILABILITY_STATUS.preOrder),
        upcoming: parsed.has(AVAILABILITY_STATUS.upcoming),
      });
    }

    const loadedFilters: Record<string, Set<string>> = {};
    filterOptions.forEach((filter) => {
      const param = searchParams.get(filterOptionQueryKey(filter.title));
      loadedFilters[filter.title] = new Set(
        param
          ? param
              .split(",")
              .map((v) => normalizeQueryValue(filter.title, v.trim()))
              .filter(Boolean)
          : [],
      );
    });

    setSelectedFilters(loadedFilters);
  }, [searchParams]);

  const defaultOpenFilters = React.useMemo(() => {
    return [
      "price",
      "availability",
      ...filterOptions.map((filter) => filter.title.toLowerCase().replace(/\s+/g, "-")),
    ];
  }, []);

  return (
    <aside className={cn("w-full shrink-0 lg:w-64", className)}>
      <Accordion multiple defaultValue={defaultOpenFilters} className="flex flex-col gap-2">
        {/** Price range filter */}
        <AccordionItem value="price" className="rounded bg-card shadow-sm border-border shadow-sidebar-border">
          <AccordionTrigger className="border-gray-300 border-x-0 border-t-0 rounded-none px-3 py-3 text-sm font-semibold text-foreground hover:no-underline">Price Range</AccordionTrigger>
          <AccordionContent className="px-3 pb-4 pt-0 space-y-4">
            <Slider
              min={0}
              max={PRICE_MAX}
              step={500}
              value={range}
              onValueChange={(v) => {
                if (Array.isArray(v) && v.length === 2) setRange([v[0], v[1]]);
              }}
              className="py-6 [&_[data-slot=slider-track]]:bg-chart-1/40 [&_[data-slot=slider-range]]:bg-chart-1 [&_[data-slot=slider-thumb]]:bg-chart-1"
            />

            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={0}
                max={range[1]}
                className="h-9 font-mono text-sm rounded-none"
                value={range[0]}
                onChange={(e) => setMin(e.target.valueAsNumber)}
                aria-label="Minimum price"
              />
              <span className="text-muted-foreground">—</span>
              <Input
                type="number"
                min={range[0]}
                max={PRICE_MAX}
                className="h-9 font-mono text-sm rounded-none"
                value={range[1]}
                onChange={(e) => setMax(e.target.valueAsNumber)}
                aria-label="Maximum price"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="availability" className="rounded bg-card shadow-sm border-border shadow-sidebar-border">
          <AccordionTrigger className="border-gray-300 border-x-0 border-t-0 rounded-none px-3 py-3 text-sm font-semibold text-foreground hover:no-underline">
            Availability
          </AccordionTrigger>
          <AccordionContent className="px-3 py-3 space-y-0">
            <FilterRow
              id="av-in-stock"
              label="In Stock"
              checked={availability.inStock}
              onCheckedChange={(c) => {
                const next = {...availability, inStock: c};
                setAvailability(next);
                applyAvailabilityQuery(next);
              }}
            />
            <FilterRow
              id="av-pre"
              label="Pre Order"
              checked={availability.preOrder}
              onCheckedChange={(c) => {
                const next = {...availability, preOrder: c};
                setAvailability(next);
                applyAvailabilityQuery(next);
              }}
            />
            <FilterRow
              id="av-up"
              label="Up Coming"
              checked={availability.upcoming}
              onCheckedChange={(c) => {
                const next = {...availability, upcoming: c};
                setAvailability(next);
                applyAvailabilityQuery(next);
              }}
            />
          </AccordionContent>
        </AccordionItem>

        {filterOptions.map((filter) => (
          <AccordionItem key={filter.title} value={filter.title.toLowerCase().replace(/\s+/g, "-")} className="bg-card shadow-sm border-border shadow-sidebar-border">
            <AccordionTrigger className="border-gray-300 border-x-0 border-t-0 rounded-none px-3 py-3 font-semibold hover:no-underline">
              {filter.title}
            </AccordionTrigger>
            <AccordionContent className="px-3 py-3 space-y-0 max-h-80 overflow-y-auto custom-scrollbar">
              {filter.i.map((option) => {
                const checked = selectedFilters[filter.title]?.has(option) ?? false;
                const displayLabel = checked ? `${filter.title.toLowerCase()}=${option.toLowerCase()}` : option;

                return (
                  <FilterRow
                    key={option}
                    id={`${filter.title.toLowerCase().replace(/\s+/g, "-")}-${option.toLowerCase().replace(/\s+/g, "-")}`}
                    label={displayLabel}
                    checked={checked}
                    onCheckedChange={(c) => {
                      setSelectedFilters((prev) => {
                        const next = {...prev};
                        const setForFilter = new Set(next[filter.title] ?? []);
                        if (c) setForFilter.add(option);
                        else setForFilter.delete(option);
                        next[filter.title] = setForFilter;
                        applyFilterOptionsQuery(next);
                        return next;
                      });
                    }}
                  />
                );
              })}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </aside>
  );
}
