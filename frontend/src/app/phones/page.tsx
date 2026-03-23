"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import {getPhones} from "@/lib/productApi";

interface Phone {
  _id: string;
  brand: string;
  model: string;
  price: number;
  discountPrice?: number;
  images?: {url: string}[];
  status?: string;
}

export default function PhonesPage() {
  const [phones, setPhones] = useState<Phone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPhones()
      .then(setPhones)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Phones</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {phones.map((p) => (
          <Link key={p._id} href={`/phones/${p._id}`} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
            <div className="aspect-square bg-gray-100 rounded mb-3 flex items-center justify-center">
              {p.images?.[0]?.url ? (
                <img src={p.images[0].url} alt={p.model} className="w-full h-full object-contain" />
              ) : (
                <span className="text-gray-400 text-sm">No image</span>
              )}
            </div>
            <p className="font-medium truncate">
              {p.brand} {p.model}
            </p>
            <p className="text-indigo-600 font-semibold">৳{(p.discountPrice ?? p.price).toLocaleString()}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
