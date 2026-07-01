export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  isActive?: boolean;
  autoNumber?: number | null;
  parentId?: string | null;
  createdAt?: string;
  updatedAt?: string;
  child?: Category[];
}

export interface CategoryState {
  categories: Category[];
  flatCategories: Category[]; // Keep flat list for efficient searches
  loading: boolean;
  error: string | null;
  lastFetched?: number;
}

export const initialState: CategoryState = {
  categories: [],
  flatCategories: [],
  loading: false,
  error: null,
  lastFetched: undefined,
};
