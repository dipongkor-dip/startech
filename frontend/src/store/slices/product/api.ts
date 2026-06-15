import {createAsyncThunk} from "@reduxjs/toolkit";
import {Category, Product} from "./interface";

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  stock: number;
  status: "active" | "inactive" | "out_of_stock";
}

export interface UpdateProductData {
  id: string;
  product: Partial<Product>;
}

// Helper function to get products base URL
const baseUrl = "http://localhost:5004/api/v1";

const getProductsBaseUrl = () => {
  return `${baseUrl}/products`;
};

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

// API functions
const fetchProductsAPI = async (): Promise<Product[]> => {
  const res = await fetch(getProductsBaseUrl(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || data.error || "Failed to fetch products");
  }

  return data.products || data;
};

const fetchProductByIdAPI = async (id: string): Promise<Product> => {
  const res = await fetch(`${getProductsBaseUrl()}/${id}`, {
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

  return data;
};

const createProductAPI = async (product: CreateProductData): Promise<Product> => {
  const res = await fetch(getProductsBaseUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(product),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || data.error || "Failed to create product");
  }

  return data;
};

const updateProductAPI = async ({id, product}: UpdateProductData): Promise<Product> => {
  const res = await fetch(`${getProductsBaseUrl()}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(product),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || data.error || "Failed to update product");
  }

  return data;
};

const deleteProductAPI = async (id: string): Promise<void> => {
  const res = await fetch(`${getProductsBaseUrl()}/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete product");
  }
};

// Redux thunks
export const fetchProducts = createAsyncThunk<Product[], void, {rejectValue: string}>("products/fetchProducts", async (_, {rejectWithValue}) => {
  try {
    return await fetchProductsAPI();
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch products");
  }
});

export const fetchProductById = createAsyncThunk<Product, string, {rejectValue: string}>("products/fetchProductById", async (id, {rejectWithValue}) => {
  try {
    return await fetchProductByIdAPI(id);
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch product");
  }
});

export const createProduct = createAsyncThunk<Product, CreateProductData, {rejectValue: string}>("products/createProduct", async (product, {rejectWithValue}) => {
  try {
    return await createProductAPI(product);
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to create product");
  }
});

export const updateProduct = createAsyncThunk<Product, UpdateProductData, {rejectValue: string}>("products/updateProduct", async ({id, product}, {rejectWithValue}) => {
  try {
    return await updateProductAPI({id, product});
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to update product");
  }
});

export const deleteProduct = createAsyncThunk<string, string, {rejectValue: string}>("products/deleteProduct", async (id, {rejectWithValue}) => {
  try {
    await deleteProductAPI(id);
    return id;
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to delete product");
  }
});

export const fetchCategories = createAsyncThunk<Category[], void, {rejectValue: string}>("products/fetchCategories", async (_, {rejectWithValue}) => {
  try {
    return await fetchCategoriesAPI();
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Failed to fetch categories");
  }
});
