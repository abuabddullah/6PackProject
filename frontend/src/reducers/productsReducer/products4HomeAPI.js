// Need to use the React-specific entry point to allow generating React hooks
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const products4HomeAPI = createApi({ // x
  reducerPath: "products4HomeAPI", // x
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api/v1/" }), // x
  endpoints: (builder) => ({
    getAllProducts4Home: builder.query({ // x
      query: () => `products`, // x
    }),
  }),
});

// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const { useGetAllProducts4HomeQuery } = products4HomeAPI;