export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image?: string;
  stock: number;
  status: "active" | "inactive" | "out_of_stock";
  createdAt: string;
  updatedAt: string;
}

export interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
}

export const initialState: ProductState = {
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
};

export interface CreateProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image?: string;
  stock: number;
  status: "active" | "inactive" | "out_of_stock";
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image?: string;
  stock: number;
  status: "active" | "inactive" | "out_of_stock";
  createdAt: string;
  updatedAt: string;
}
