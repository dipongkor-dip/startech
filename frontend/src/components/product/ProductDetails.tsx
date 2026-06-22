"use client";
import {useAppDispatch, useAppSelector} from "@/store/hooks";
import {fetchProductDetails} from "@/store/slices/product/api";
import React from "react";

const ProductDetails = ({slug, model}: {slug: string; model: string}) => {
  const dispatch = useAppDispatch();
  const {product, loading, error} = useAppSelector((state) => state.product);
  console.log("📂 Extracted Category Slug:", slug);
  console.log("🎯 Extracted Product Model:", model);

  React.useEffect(() => {
    if (slug && model && !error) {
      dispatch(fetchProductDetails({slug, model}));
    }
  }, [slug, model, error, dispatch]);

  console.log("product", product);

  return (
    <section className="min-h-lvh">
      <div className="max-w-7xl mx-auto">
        <h2>Product Details</h2>
      </div>
    </section>
  );
};

export default ProductDetails;
