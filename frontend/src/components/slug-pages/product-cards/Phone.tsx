import Link from "next/link";
import {CopyPlus, PackageIcon, ShoppingCart} from "lucide-react";
import {Card, CardContent, CardFooter} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";
import {Button} from "@base-ui/react";

function formatPrice(n: number) {
  return `${n.toLocaleString("en-BD")}৳`;
}

export default function Product({product, className}: {product: any; className?: string}) {
  return (
    <Card size="sm" className={cn("relative overflow-visible transition-shadow border-none ring-0 rounded shadow-sm hover:shadow-md", className)}>
      {product.discountPrice ? (
        <Badge variant="secondary" className="absolute top-2 right-2 z-10 bg-violet-600 text-white hover:bg-violet-600">
          Save: {formatPrice(product.discountPrice)}
        </Badge>
      ) : null}

      <div className="flex aspect-square items-center justify-center bg-muted/60 border-b-[0.5px]">
        <PackageIcon className="size-14 text-muted-foreground/60" aria-hidden />
      </div>

      <CardContent className="border-b-[0.5px] mx-2 py-3">
        <Link href="#" className="line-clamp-2 font-heading text-sm font-semibold leading-snug text-foreground hover:text-chart-1 hover:underline">
          {product?.model}
        </Link>
        <ul className="mt-4 list-inside list-disc space-y-2 text-xs font-medium text-muted-foreground">
          <li className="marker:text-muted-foreground/70">Display: {product.display}</li>
          <li className="marker:text-muted-foreground/70">Processor: {product.processor}</li>
          <li className="marker:text-muted-foreground/70">
            Camera: {product.camera.font}, {product.camera.rear}
          </li>
          <li className="marker:text-muted-foreground/70">
            Features:
            {product.features.map((f: string, i: number) => {
              return (
                <span key={i} className="mr-1">
                  {f}
                </span>
              );
            })}
          </li>
        </ul>
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-3 border-t-0 bg-transparent mt-0">
        <div className="flex justify-center w-full items-baseline gap-1">
          <span className="text-base font-bold text-chart-1">{formatPrice(product.price - product.discountPrice)}</span>
          <span className="text-sm font-semibold line-through text-muted-foreground">{formatPrice(product.price)}</span>
        </div>

        <Button className="w-full bg-background text-blue-500 font-medium py-1.5 flex justify-center items-center gap-2 hover:bg-blue-600 hover:text-white">
          <ShoppingCart size={16} />
          <strong>Buy Now</strong>
        </Button>

        <Button className="w-full text-muted-foreground font-light text-xs py-1.5 flex justify-center items-center gap-1 hover:bg-background hover:text-foreground">
          <CopyPlus size={15} />
          <strong>Add to Compare</strong>
        </Button>
      </CardFooter>
    </Card>
  );
}
