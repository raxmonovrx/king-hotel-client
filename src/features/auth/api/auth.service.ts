import { apiSlice } from "@/app/api.service";
import type { ApiResponse, AuthUser } from "@/types/api";
import { clearUser, setUser } from "./auth.slice";

type AuthBody = {
  email: string;
  password: string;
};

export const authApi = apiSlice.injectEndpoints({
  endpoints: (b) => ({
    register: b.mutation<ApiResponse<AuthUser>, AuthBody>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.data));
        } catch {}
      },
    }),

    login: b.mutation<ApiResponse<AuthUser>, AuthBody>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.data));
        } catch {}
      },
    }),

    logout: b.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(clearUser());
        }
      },
    }),

    me: b.query<ApiResponse<AuthUser>, void>({
      query: () => ({ url: "/auth/me" }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.data));
        } catch {
          dispatch(clearUser());
        }
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useMeQuery,
} = authApi;
