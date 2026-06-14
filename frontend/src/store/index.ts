import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./slices/auth/authSlice";
import productReducer from "./slices/product/productSlice";
import {persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistedAuthReducer = persistReducer({key: "auth", storage, whitelist: ["needPasswordChange", "isAuthenticated", "initialized", "loginCredential"]}, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    products: productReducer,
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
