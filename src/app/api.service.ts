import {
  retry,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// BASE QUERY
export const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3000/api",
  credentials: "include",
});

// AUTH + NETWORK COUNTER WRAPPER
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const res = await baseQuery(args, api, extraOptions);

  if (res.error?.status === 401) {
    sessionStorage.clear();
  }

  return res;
};

// RETRY WRAPPER
const baseQueryWithRetry = retry(baseQueryWithReauth, { maxRetries: 0 });

// API SLICE
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithRetry,
  tagTypes: ["Me", "MyRequests", "OwnerRequests"] as const,
  endpoints: () => ({}),
});
