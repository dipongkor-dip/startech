"use client";

import * as React from "react";
import {Slider} from "@/components/ui/slider";
import {Input} from "@/components/ui/input";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";
import {cn} from "@/lib/utils";
import {is} from "zod/locales";
import {filtersProducts} from "@/data/sidebar-filters";

const PRICE_MAX = 953_700;

type FilterCheckboxProps = {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

function FilterRow({id, label, checked, onCheckedChange}: FilterCheckboxProps) {
  return (
    <div className="flex items-center gap-2 py-1">
      <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} />
      <Label htmlFor={id} className="cursor-pointer font-normal text-muted-foreground">
        {label}
      </Label>
    </div>
  );
}

export function CategoryFilters({className}: {className?: string}) {
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

  return (
    <aside className={cn("w-full shrink-0 lg:w-64", className)}>
      <Accordion multiple defaultValue={["price", "availability", "processor", "ram"]} className="flex flex-col gap-4">
        <AccordionItem value="price" className="rounded bg-card shadow-md">
          <AccordionTrigger className="border-gray-300 border-x-0 border-t-0 rounded-none px-3 py-3 text-sm font-semibold text-foreground hover:no-underline">
            Price Range
          </AccordionTrigger>
          <AccordionContent className="px-3 pb-4 pt-0 space-y-4">
            <Slider
              className="[&_[data-slot=slider-range]]:!bg-orange-500"
              min={0}
              max={PRICE_MAX}
              step={500}
              value={range}
              onValueChange={(v) => {
                if (Array.isArray(v) && v.length === 2) setRange([v[0], v[1]]);
              }}
            />
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={0}
                max={range[1]}
                className="h-9 font-mono text-sm"
                value={range[0]}
                onChange={(e) => setMin(e.target.valueAsNumber)}
                aria-label="Minimum price"
              />
              <span className="text-muted-foreground">—</span>
              <Input
                type="number"
                min={range[0]}
                max={PRICE_MAX}
                className="h-9 font-mono text-sm"
                value={range[1]}
                onChange={(e) => setMax(e.target.valueAsNumber)}
                aria-label="Maximum price"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="availability" className="bg-card shadow-md">
          <AccordionTrigger className="border-gray-300 border-x-0 border-t-0 rounded-none px-3 py-3 text-sm font-semibold text-foreground hover:no-underline">
            Availability
          </AccordionTrigger>
          <AccordionContent className="px-3 py-3 space-y-0">
            <FilterRow id="av-in-stock" label="In Stock" checked={availability.inStock} onCheckedChange={(c) => setAvailability((s) => ({...s, inStock: c}))} />
            <FilterRow id="av-pre" label="Pre Order" checked={availability.preOrder} onCheckedChange={(c) => setAvailability((s) => ({...s, preOrder: c}))} />
            <FilterRow id="av-up" label="Up Coming" checked={availability.upcoming} onCheckedChange={(c) => setAvailability((s) => ({...s, upcoming: c}))} />
          </AccordionContent>
        </AccordionItem>

        {
          /* Additional filters can be added here following the same pattern */
          filtersProducts.map((filter) => (
            <AccordionItem key={filter.title} value={filter.title.toLowerCase().replace(/\s+/g, "-")} className="bg-card shadow-md">
              <AccordionTrigger className="border-gray-300 border-x-0 border-t-0 rounded-none px-3 py-3 text-sm font-semibold text-foreground hover:no-underline">
                {filter.title}
              </AccordionTrigger>
              <AccordionContent className="px-3 py-3 space-y-0">
                {filter.i.map((option) => (
                  <FilterRow
                    key={option}
                    id={`${filter.title.toLowerCase().replace(/\s+/g, "-")}-${option.toLowerCase().replace(/\s+/g, "-")}`}
                    label={option}
                    checked={false} // This should be connected to state for each filter option
                    onCheckedChange={(c) => {
                      // Handle state change for this filter option
                    }}
                  />
                ))}
              </AccordionContent>
            </AccordionItem>
          ))
        }
      </Accordion>
    </aside>
  );
}
