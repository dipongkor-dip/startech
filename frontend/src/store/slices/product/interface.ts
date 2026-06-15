export interface Category {
  slug: string;
  name: string;
  isActive: boolean;
  autoNumber: number | null;
  child?: Category[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  createdAt: string;
  updatedAt: string;
}

export interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  categories: Category[];
  loading: boolean;
  error: string | null;
  categoriesLoading: boolean;
  categoriesError: string | null;
}

export const initialState: ProductState = {
  products: [],
  currentProduct: null,
  categories: [],
  loading: false,
  error: null,
  categoriesLoading: false,
  categoriesError: null,
};