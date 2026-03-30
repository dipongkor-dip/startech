"use client";

import { CategoryProductCard } from "@/components/category/CategoryProductCard";

// Mock product data for featured products
const mockProducts = [
  {
    id: "1",
    title: "Starlink Mini Kit",
    price: 21200,
    originalPrice: 26500,
    discountLabel: "Save: 5,300৳ (-20%)",
    specs: ["High-speed internet", "Easy setup", "Portable"],
  },
  {
    id: "2",
    title: "Xtrike Me GC-907 RGB Gaming Chair",
    price: 18500,
    originalPrice: undefined,
    discountLabel: "Earn Point: 400",
    specs: ["Ergonomic design", "RGB lighting", "Adjustable height"],
  },
  {
    id: "3",
    title: "RTX 4090 Gaming PC",
    price: 285000,
    originalPrice: 320000,
    discountLabel: "Save: 35,000৳ (-11%)",
    specs: ["Intel i9-13900K", "32GB DDR5", "2TB NVMe SSD"],
  },
  {
    id: "4",
    title: "MacBook Pro 16\" M3 Max",
    price: 325000,
    originalPrice: 365000,
    discountLabel: "Save: 40,000৳ (-11%)",
    specs: ["M3 Max chip", "36GB RAM", "1TB SSD", "Liquid Retina XDR"],
  },
  {
    id: "5",
    title: "iPhone 15 Pro Max 256GB",
    price: 158000,
    originalPrice: 175000,
    discountLabel: "Save: 17,000৳ (-10%)",
    specs: ["A17 Pro chip", "Titanium", "Pro camera system"],
  },
  {
    id: "6",
    title: "Samsung Odyssey G9 49\" Curved",
    price: 125000,
    originalPrice: 145000,
    discountLabel: "Save: 20,000৳ (-14%)",
    specs: ["Dual QHD", "240Hz", "HDR1000", "1000R curve"],
  },
  {
    id: "7",
    title: "ASUS ROG Strix G18",
    price: 195000,
    originalPrice: undefined,
    discountLabel: "Earn Point: 800",
    specs: ["Intel i9-13980HX", "RTX 4080", "32GB RAM", "2TB SSD"],
  },
  {
    id: "8",
    title: "Sony WH-1000XM5 Headphones",
    price: 28500,
    originalPrice: 35000,
    discountLabel: "Save: 6,500৳ (-19%)",
    specs: ["Active Noise Cancellation", "30hr battery", "Hi-Res Audio"],
  },
];

export function FeaturedProducts() {
  return (
      <>
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Featured Products
          </h2>
          <p className="text-lg">
            Get Your Desired Product from Featured Category!
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mockProducts.map((product) => (
            <CategoryProductCard 
              key={product.id} 
              product={product}
              className="hover:shadow-xl transition-shadow duration-200"
            />
          ))}
        </div>
      </>
  );
}
