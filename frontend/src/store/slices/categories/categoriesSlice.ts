import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {initialState, Category} from "./interface";
import {fetchCategories} from "./api";

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    addCate: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch categories";
      });
  },
});

export const {addCate, clearError, reset} = categoriesSlice.actions;
export default categoriesSlice.reducer;
