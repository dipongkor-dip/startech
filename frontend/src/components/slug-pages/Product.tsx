import Link from "next/link";
import {PackageIcon} from "lucide-react";
import {Card, CardContent, CardFooter} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";
import type {MockProduct} from "@/lib/category-listing";

function formatPrice(n: number) {
  return `৳ ${n.toLocaleString("en-BD")}`;
}

export default function Product({product, className}: {product: any; className?: string}) {
  return (
    <Card size="sm" className={cn("relative overflow-visible transition-shadow shadow-md border-none ring-0 rounded", className)}>
      {product.discountLabel ? (
        <Badge variant="secondary" className="absolute top-2 right-2 z-10 bg-violet-600 text-white hover:bg-violet-600">
          {product.discountLabel}
        </Badge>
      ) : null}

      <div className="flex aspect-square items-center justify-center bg-muted/60 px-4 pt-2">
        <PackageIcon className="size-14 text-muted-foreground/60" aria-hidden />
      </div>

      <CardContent className="px-3 pt-2 pb-1">
        <Link href="#" className="line-clamp-2 font-heading text-sm font-semibold leading-snug text-foreground hover:text-chart-1 hover:underline">
          {product?.title}
        </Link>
        <ul className="mt-2 list-inside list-disc space-y-0.5 text-xs text-muted-foreground">
          {/* {product.specs.map((s) => (
            <li key={s} className="marker:text-muted-foreground/70">
              {s}
            </li>
          ))} */}
        </ul>
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-1 border-t-0 bg-transparent px-3 pt-0 pb-3">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-base font-bold text-chart-1">{formatPrice(product.price)}</span>
          {product.originalPrice ? <span className="text-sm text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span> : null}
        </div>
      </CardFooter>
    </Card>
  );
}
