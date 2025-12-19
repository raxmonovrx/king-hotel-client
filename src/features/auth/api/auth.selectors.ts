import type { RootState } from "@/app/store";
export const selectUser = (s: RootState) => s.auth.user;
