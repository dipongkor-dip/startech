import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {initialState, Category} from "./interface";
import {fetchCategories} from "./api";
import {buildCategoryTree, flattenCategories} from "@/lib/category-utils";

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    /**
     * Manually set categories (useful for admin updates)
     */
    setCategories: (state, action: PayloadAction<Category[]>) => {
      const flatCategories = action.payload;
      state.flatCategories = flatCategories;
      state.categories = buildCategoryTree(flatCategories);
      state.lastFetched = Date.now();
    },

    /**
     * Clear categories and error state
     */
    clearCategories: (state) => {
      state.categories = [];
      state.flatCategories = [];
      state.error = null;
      state.loading = false;
    },

    /**
     * Clear error message
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Reset to initial state
     */
    reset: () => initialState,
  },

  extraReducers: (builder) => {
    builder
      // Fetch categories pending
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // Fetch categories fulfilled
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;

        // Store flat list for efficient searches
        const flatCategories = action.payload;
        state.flatCategories = flatCategories;

        // Build and store hierarchical tree for UI rendering
        state.categories = buildCategoryTree(flatCategories);

        // Update cache timestamp
        state.lastFetched = Date.now();
      })

      // Fetch categories rejected
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch categories";
      });
  },
});

export const {setCategories, clearCategories, clearError, reset} = categoriesSlice.actions;
export default categoriesSlice.reducer;
