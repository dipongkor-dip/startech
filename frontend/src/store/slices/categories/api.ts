import {createAsyncThunk} from "@reduxjs/toolkit";
import {Category} from "./interface";

// Configuration
const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_PRODUCT_API_URL || "http://localhost:5004/api/v1",
  ENDPOINTS: {
    CATEGORIES: "/categories",
  },
  TIMEOUT: 10000,
};

const getCategoriesUrl = () => `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CATEGORIES}`;

/**
 * Fetch categories from API
 * @throws Error if API request fails
 */
export const fetchCategoriesAPI = async (): Promise<Category[]> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const res = await fetch(getCategoriesUrl(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      signal: controller.signal,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || data.error || `HTTP Error: ${res.status}`);
    }

    if (!Array.isArray(data?.data)) {
      throw new Error("Invalid response format: expected array of categories");
    }

    return data.data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error("Request timeout: Categories fetch took too long");
      }
      throw error;
    }
    throw new Error("Unknown error occurred while fetching categories");
  } finally {
    clearTimeout(timeoutId);
  }
};

/**
 * Redux thunk for fetching categories
 */
export const fetchCategories = createAsyncThunk<Category[], void, {rejectValue: string}>(
  "categories/fetchCategories",
  async (_, {rejectWithValue}) => {
    try {
      return await fetchCategoriesAPI();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to fetch categories";
      console.error("[Categories API Error]", message);
      return rejectWithValue(message);
    }
  }
);
