// src/components/layout/app-layout.tsx
import { Outlet } from "react-router-dom";
import { Header } from "./header";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-[#0b0b12] text-white">
      {/* Outer frame */}
      <div className="mx-auto min-h-screen max-w-360">
        <Header />

        <main className="px-6 py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
