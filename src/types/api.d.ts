export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

// =====================
// Types
// =====================
export type Currency = "USD" | "RUB";
export type RequestStatus = "new" | "accepted" | "rejected";

export type RequestCreateBody = {
  destination: string;
  check_in: string; // YYYY-MM-DD
  check_out: string; // YYYY-MM-DD
  guests: number;
  budget_per_night: number;
  currency?: Currency;
  wishes?: string;
  contact_name: string;
  phone: string;
  telegram?: string;
};

export type RequestItem = {
  id: string;
  destination: string;
  check_in: string;
  check_out: string;
  guests: number;
  budget_per_night: number;
  currency: Currency;
  wishes: string | null;
  contact_name: string;
  phone: string;
  telegram: string | null;
  status: RequestStatus;
  created_at: string;
};

export type OwnerRequestItem = RequestItem & { user_email: string };
