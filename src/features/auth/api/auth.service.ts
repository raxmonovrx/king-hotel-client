import { apiSlice } from "@/app/api.service";
import type { ApiResponse } from "@/types/api";

type AuthBody = {
  email: string;
  password: string;
};

export const authApi = apiSlice.injectEndpoints({
  endpoints: (b) => ({
    // #1 register
    register: b.mutation<ApiResponse<null>, AuthBody>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),

    // #2 login
    login: b.mutation<ApiResponse<null>, AuthBody>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),

    // #3 logout
    logout: b.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useLogoutMutation } =
  authApi;
