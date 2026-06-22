import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ProductDetails, initialState} from "./interface";
import {fetchProductDetails} from "./api";

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setCurrentProduct: (state, action: PayloadAction<ProductDetails | null>) => {
      state.product = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch product by categorySlug and product model
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch product";
      });
  },
});

export const {setCurrentProduct, clearError, reset} = productSlice.actions;
export default productSlice.reducer;
