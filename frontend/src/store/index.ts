import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./slices/auth/authSlice";
import categoriesSlice from "./slices/categories/categoriesSlice";
import productsReducer from "./slices/products/productsSlice";
import productReducer from "./slices/product/productSlice";
import {persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistedAuthReducer = persistReducer({key: "auth", storage, whitelist: ["needPasswordChange", "isAuthenticated", "initialized", "loginCredential"]}, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    categories: categoriesSlice,
    products: productsReducer,
    product: productReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
