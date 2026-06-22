import {createAsyncThunk} from "@reduxjs/toolkit";
import {Category} from "./interface";

// Helper function to get products base URL
const baseUrl = "http://localhost:5004/api/v1";

const getCategoriesBaseUrl = () => {
  return `${baseUrl}/categories`;
};

export const fetchCategoriesAPI = async (): Promise<Category[]> => {
  const res = await fetch(getCategoriesBaseUrl(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || data.error || "Failed to fetch categories");
  }

  return data.data;
};

export const fetchCategories = createAsyncThunk<Category[], void, {rejectValue: string}>("products/fetchCategories", async (_, {rejectWithValue}) => {
  try {
    return await fetchCategoriesAPI();
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch categories");
  }
});
