import {baseApi, SERVICES_URL} from "@/store/baseAPI";
import {Product, CreateProductData, UpdateProductData} from "./interface";

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 🔍 ১. সব প্রোডাক্ট ফেচ করা (কোয়েরি প্যারামিটারসহ)
    getProducts: builder.query<Product[], any>({
      query: (params) => {
        return {
          url: `${SERVICES_URL.PRODUCT}/products`,
          method: "GET",
          params: params,
        };
      },
      transformResponse: (response: any) => response?.data?.products ?? [],
      providesTags: ["PRODUCTS"],
    }),

    // 🔍 ২. একটি নির্দিষ্ট প্রোডাক্ট ফেচ করা
    getProductById: builder.query<Product, string>({
      query: (id) => ({
        url: `${SERVICES_URL.PRODUCT}/products/${id}`,
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data ?? response,
      providesTags: (result, error, id) => [{type: "PRODUCT", id}],
    }),

    // ➕ ৩. নতুন প্রোডাক্ট তৈরি করা
    createProduct: builder.mutation<Product, CreateProductData>({
      query: (newProduct) => ({
        url: `${SERVICES_URL.PRODUCT}/products`,
        method: "POST",
        body: newProduct,
      }),
      // প্রোডাক্ট ক্রিয়েট হলে অটোমেটিক সব প্রোডাক্টের লিস্ট রি-ফেচ হবে
      invalidatesTags: ["PRODUCTS"],
    }),

    // 📝 ৪. প্রোডাক্ট আপডেট করা
    // updateProduct: builder.mutation<Product, UpdateProductData>({
    //   query: ({id, product}) => ({
    //     url: `${SERVICES_URL.PRODUCT}/products/${id}`,
    //     method: "PUT",
    //     body: product,
    //   }),
    //   // আপডেট হলে মেইন লিস্ট এবং ঐ নির্দিষ্ট প্রোডাক্টের ক্যাশ দুইটাই রিফ্রেশ হবে
    //   invalidatesTags: (result, error, {id}) => ["PRODUCTS", {type: "PRODUCT", id}],
    // }),

    // ❌ ৫. প্রোডাক্ট ডিলিট করা
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `${SERVICES_URL.PRODUCT}/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PRODUCTS"],
    }),
  }),
});

// ফ্রন্টএন্ডে ব্যবহারের জন্য অটো-জেনারেটেড হুকগুলো এক্সপোর্ট করা হচ্ছে
export const {useGetProductsQuery, useGetProductByIdQuery, useCreateProductMutation, useDeleteProductMutation} = productsApi;
