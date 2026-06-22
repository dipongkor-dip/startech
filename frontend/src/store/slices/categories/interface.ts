export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  isActive: boolean;
  autoNumber: number | null;
  child?: Category[];
}

export interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

export const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};
