// src/components/layout/app-layout.tsx
import { useMeQuery } from "@/features/auth/api/auth.service";
import { Outlet } from "react-router-dom";
import { Header } from "./header";

export function AppLayout() {
  useMeQuery(undefined);
  return (
    <div className="min-h-screen bg-[#0b0b12] text-white">
      {/* Outer frame */}
      <div className="mx-auto min-h-screen max-w-360">
        <Header />

        <main className="px-0 py-8 sm:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
