import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const SERVICES_URL = {
  USER: "http://localhost:5003/api/v1",
  PRODUCT: "http://localhost:5004/api/v1", // প্রোডাক্ট সার্ভিসের বেস ইউআরএল
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "", // এন্ডপয়েন্ট থেকে ফুল ডাইনামিক ইউআরএল যাবে
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["PRODUCTS", "PRODUCT"], // প্রোডাক্টের জন্য ক্যাশ ট্যাগ
  endpoints: () => ({}),
});
