"use client";

import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import {getPhoneById} from "@/lib/productApi";

interface DescriptionBlock {
  items: {title: string; des: string}[];
  pic?: string;
}

interface Phone {
  _id: string;
  brand: string;
  model: string;
  productCode?: string;
  price: number;
  discountPrice?: number;
  status?: string;
  images?: {url: string}[];
  display?: string;
  processor?: string;
  camera?: {font?: string; rear?: string};
  features?: string[];
  options?: {ram?: string; storage?: string; color?: string}[];
  description?: DescriptionBlock[];
}

export default function PhoneDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [phone, setPhone] = useState<Phone | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getPhoneById(id)
      .then(setPhone)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error || !phone) return <div className="p-8 text-red-600">Error: {error || "Phone not found"}</div>;

  const breadcrumbs = [
    {label: "Home", href: "/"},
    {label: "Phone", href: "/phones"},
    {label: phone.brand, href: `/phones?brand=${phone.brand}`},
    {label: `${phone.brand} ${phone.model}`, href: undefined},
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumbs items={breadcrumbs} />

      <div className="grid md:grid-cols-2 gap-8 mt-4">
        {/* Image */}
        <div>
          <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
            {phone.images?.[0]?.url ? (
              <img src={phone.images[0].url} alt={phone.model} className="w-full h-full object-contain" />
            ) : (
              <span className="text-gray-400">No image</span>
            )}
          </div>
          {phone.status && <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">{phone.status}</span>}
        </div>

        {/* Info */}
        <div>
          <h1 className="text-2xl font-bold">
            {phone.brand} {phone.model}
          </h1>
          {phone.productCode && <p className="text-sm text-gray-500 mt-1">Product Code: {phone.productCode}</p>}
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-bold text-indigo-600">৳{(phone.discountPrice ?? phone.price).toLocaleString()}</span>
            {phone.discountPrice && phone.price > phone.discountPrice && <span className="text-gray-500 line-through">৳{phone.price.toLocaleString()}</span>}
          </div>

          {phone.options && phone.options.length > 0 && (
            <div className="mt-6 space-y-4">
              {phone.options.some((o) => o.storage) && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">RAM / Storage</p>
                  <div className="flex flex-wrap gap-2">
                    {phone.options.map(
                      (o, i) =>
                        o.storage && (
                          <button key={i} className="px-4 py-2 border border-gray-300 rounded-lg hover:border-indigo-600 hover:bg-indigo-50">
                            {o.storage}
                          </button>
                        ),
                    )}
                  </div>
                </div>
              )}
              {phone.options.some((o) => o.color) && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Color</p>
                  <div className="flex flex-wrap gap-2">
                    {phone.options.map(
                      (o, i) =>
                        o.color && (
                          <button key={i} className="px-4 py-2 border border-gray-300 rounded-lg hover:border-indigo-600 hover:bg-indigo-50">
                            {o.color}
                          </button>
                        ),
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {phone.display && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Display</p>
              <p className="text-gray-900">{phone.display}</p>
            </div>
          )}
          {phone.processor && (
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Processor</p>
              <p className="text-gray-900">{phone.processor}</p>
            </div>
          )}
          {phone.camera && (
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Camera</p>
              <p className="text-gray-900">
                {phone.camera.rear && `Rear: ${phone.camera.rear}`}
                {phone.camera.font && ` | Front: ${phone.camera.font}`}
              </p>
            </div>
          )}
          {phone.features && phone.features.length > 0 && (
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Features</p>
              <p className="text-gray-900">{phone.features.join(", ")}</p>
            </div>
          )}
        </div>
      </div>

      {/* Description blocks */}
      {phone.description && phone.description.length > 0 && (
        <section className="mt-12 border-t pt-8">
          <h2 className="text-xl font-bold mb-6">Product Description</h2>
          <div className="space-y-8">
            {phone.description.map((block, bi) => (
              <div key={bi} className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-3">
                  {block.items?.map((item, ii) => (
                    <div key={ii}>
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <p className="text-gray-600">{item.des}</p>
                    </div>
                  ))}
                </div>
                {block.pic && (
                  <div className="w-full md:w-64 shrink-0">
                    <img src={block.pic} alt="" className="rounded-lg object-cover w-full h-48" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
