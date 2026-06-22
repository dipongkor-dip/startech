import {createAsyncThunk} from "@reduxjs/toolkit";
import {ProductDetails} from "./interface";

const baseUrl = "http://localhost:5004/api/v1";

const getProductsBaseUrl = () => {
  return `${baseUrl}/product`;
};

const fetchProductDetailsAPI = async (payload: {slug: string; model: string}): Promise<ProductDetails> => {
  const res = await fetch(`${getProductsBaseUrl()}/${payload.slug}/${payload.model}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || data.error || "Failed to fetch product");
  }

  return data.data;
};

export const fetchProductDetails = createAsyncThunk<ProductDetails, {slug: string; model: string}, {rejectValue: string}>(
  "product/fetchProductDetails",
  async (payload, {rejectWithValue}) => {
    try {
      return await fetchProductDetailsAPI(payload);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch product");
    }
  },
);
