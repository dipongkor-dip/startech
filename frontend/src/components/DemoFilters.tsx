"use client";

import * as React from "react";
import {Slider} from "@/components/ui/slider";
import {Input} from "@/components/ui/input";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";
import {cn} from "@/lib/utils";

const PRICE_MAX = 953700;

type FilterCheckboxProps = {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

function FilterRow({id, label, checked, onCheckedChange}: FilterCheckboxProps) {
  return (
    <div className="flex items-center gap-2 py-1">
      <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} className={`border-gray-400 rounded ${checked && "bg-blue-500 text-white font-bold"}`} />
      <Label htmlFor={id} className="cursor-pointer font-medium text-sm">
        {label}
      </Label>
    </div>
  );
}

export function DemoFilter() {
  const [range, setRange] = React.useState<[number, number]>([0, PRICE_MAX]);
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const [availability, setAvailability] = React.useState({
    inStock: false,
    preOrder: false,
    upcoming: false,
  });

  // Cleanup debounce timeout on unmount

  const defaultOpenFilters = React.useMemo(() => {
    return ["price", "availability"];
  }, []);

  return (
    <aside className={cn("w-full shrink-0 lg:w-64")}>
      <Accordion multiple defaultValue={defaultOpenFilters} className="flex flex-col gap-2">
        {/** Price range filter */}
        <AccordionItem value="price" className="rounded bg-card shadow-sm border-border shadow-sidebar-border">
          <AccordionTrigger className="border-gray-300 dark:border-gray-700 border-x-0 border-t-0 rounded-none px-3 py-3 text-sm font-semibold text-foreground hover:no-underline">
            Price Range
          </AccordionTrigger>
          <AccordionContent className="px-3 pb-4 pt-0 space-y-4">
            <Slider
              min={0}
              max={PRICE_MAX}
              step={500}
              value={range}
              className="py-6 [&_[data-slot=slider-track]]:h-2 [&_[data-slot=slider-track]]:bg-[#e7e8ee] [&_[data-slot=slider-range]]:bg-chart-1 [&_[data-slot=slider-thumb]]:size-5 [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-thumb]]:border-white dark:[&_[data-slot=slider-thumb]]:border-gray-300 [&_[data-slot=slider-thumb]]:bg-chart-1 [&_[data-slot=slider-thumb]]:shadow-[0_0_0_2px_rgba(249,115,22,0.35)]"
            />

            <div className="flex items-center gap-2">
              <Input type="number" min={0} max={range[1]} className="h-9 font-mono text-sm rounded-none" value={range[0]} aria-label="Minimum price" />
              <span className="text-muted-foreground">—</span>
              <Input type="number" min={range[0]} max={PRICE_MAX} className="h-9 font-mono text-sm rounded-none" value={range[1]} aria-label="Maximum price" />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="availability" className="rounded bg-card shadow-sm border-border shadow-sidebar-border">
          <AccordionTrigger className="border-gray-300 dark:border-gray-700 border-x-0 border-t-0 rounded-none px-3 py-3 text-sm font-semibold text-foreground hover:no-underline">
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
              }}
            />
            <FilterRow
              id="av-pre"
              label="Pre Order"
              checked={availability.preOrder}
              onCheckedChange={(c) => {
                const next = {...availability, preOrder: c};
                setAvailability(next);
              }}
            />
            <FilterRow
              id="av-up"
              label="Up Coming"
              checked={availability.upcoming}
              onCheckedChange={(c) => {
                const next = {...availability, upcoming: c};
                setAvailability(next);
              }}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
}
