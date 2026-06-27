import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./slices/auth/authSlice";
import categoriesSlice from "./slices/categories/categoriesSlice";
import productReducer from "./slices/product/productSlice";
import {baseApi} from "./baseAPI";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoriesSlice,
    product: productReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
