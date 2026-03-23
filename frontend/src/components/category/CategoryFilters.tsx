'use client';

import * as React from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const PRICE_MAX = 953_700;

type FilterCheckboxProps = {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

function FilterRow({ id, label, checked, onCheckedChange }: FilterCheckboxProps) {
  return (
    <div className="flex items-center gap-2 py-1">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
      <Label htmlFor={id} className="cursor-pointer font-normal text-muted-foreground">
        {label}
      </Label>
    </div>
  );
}

export function CategoryFilters({ className }: { className?: string }) {
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
    <aside className={cn('w-full shrink-0 lg:w-64', className)}>
      <Accordion
        multiple
        defaultValue={['price', 'availability', 'processor', 'ram']}
        className="flex flex-col gap-4"
      >
        <AccordionItem value="price" className="border-b-0 rounded-xl border border-border bg-card ring-1 ring-foreground/5">
          <AccordionTrigger className="border-0 rounded-none px-3 py-3 text-sm font-semibold text-foreground hover:no-underline">
            Price Range
          </AccordionTrigger>
          <AccordionContent className="px-3 pb-4 space-y-4">
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

        <AccordionItem value="availability" className="border-b-0 rounded-xl border border-border bg-card ring-1 ring-foreground/5">
          <AccordionTrigger className="border-0 rounded-none px-3 py-3 text-sm font-semibold text-foreground hover:no-underline">
            Availability
          </AccordionTrigger>
          <AccordionContent className="px-3 pb-3 space-y-0">
            <FilterRow
              id="av-in-stock"
              label="In Stock"
              checked={availability.inStock}
              onCheckedChange={(c) => setAvailability((s) => ({ ...s, inStock: c }))}
            />
            <FilterRow
              id="av-pre"
              label="Pre Order"
              checked={availability.preOrder}
              onCheckedChange={(c) => setAvailability((s) => ({ ...s, preOrder: c }))}
            />
            <FilterRow
              id="av-up"
              label="Up Coming"
              checked={availability.upcoming}
              onCheckedChange={(c) => setAvailability((s) => ({ ...s, upcoming: c }))}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="processor" className="border-b-0 rounded-xl border border-border bg-card ring-1 ring-foreground/5">
          <AccordionTrigger className="border-0 rounded-none px-3 py-3 text-sm font-semibold text-foreground hover:no-underline">
            Processor
          </AccordionTrigger>
          <AccordionContent className="px-3 pb-3 space-y-0">
            <FilterRow
              id="cpu-intel"
              label="Intel"
              checked={processor.intel}
              onCheckedChange={(c) => setProcessor((s) => ({ ...s, intel: c }))}
            />
            <FilterRow
              id="cpu-amd"
              label="AMD"
              checked={processor.amd}
              onCheckedChange={(c) => setProcessor((s) => ({ ...s, amd: c }))}
            />
            <FilterRow
              id="cpu-apple"
              label="Apple"
              checked={processor.apple}
              onCheckedChange={(c) => setProcessor((s) => ({ ...s, apple: c }))}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="ram" className="border-b-0 rounded-xl border border-border bg-card ring-1 ring-foreground/5">
          <AccordionTrigger className="border-0 rounded-none px-3 py-3 text-sm font-semibold text-foreground hover:no-underline">
            RAM
          </AccordionTrigger>
          <AccordionContent className="px-3 pb-3 space-y-0">
            <FilterRow
              id="ram-8"
              label="8 GB"
              checked={ram.gb8}
              onCheckedChange={(c) => setRam((s) => ({ ...s, gb8: c }))}
            />
            <FilterRow
              id="ram-16"
              label="16 GB"
              checked={ram.gb16}
              onCheckedChange={(c) => setRam((s) => ({ ...s, gb16: c }))}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
}
