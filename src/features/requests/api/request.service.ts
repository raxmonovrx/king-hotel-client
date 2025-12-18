import { apiSlice } from "@/app/api.service";
import type {
  ApiResponse,
  OwnerRequestItem,
  RequestCreateBody,
  RequestItem,
  RequestStatus,
} from "@/types/api";

// =====================
// API
// =====================
export const requestsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // #1 create request
    createRequest: builder.mutation<
      ApiResponse<RequestItem>,
      RequestCreateBody
    >({
      query: (body) => ({
        url: "/request/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["MyRequests"],
    }),

    // #2 my requests
    myRequests: builder.query<ApiResponse<RequestItem[]>, void>({
      query: () => ({ url: "/request/my" }),
      providesTags: ["MyRequests"],
    }),

    // #3 owner requests (filter by status)
    ownerRequests: builder.query<
      ApiResponse<OwnerRequestItem[]>,
      { status?: RequestStatus } | void
    >({
      query: (arg) => ({
        url: "/owner/requests",
        params: arg?.status ? { status: arg.status } : undefined,
      }),
      providesTags: ["OwnerRequests"],
    }),

    // #4 owner update status
    ownerUpdateStatus: builder.mutation<
      ApiResponse<{ id: string; status: RequestStatus }>,
      { id: string; status: Exclude<RequestStatus, "new"> }
    >({
      query: ({ id, status }) => ({
        url: `/owner/requests/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["OwnerRequests"],
    }),
  }),
});

export const {
  useCreateRequestMutation,
  useMyRequestsQuery,
  useOwnerRequestsQuery,
  useOwnerUpdateStatusMutation,
} = requestsApi;
