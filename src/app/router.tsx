import { AppLayout } from "@/components/layout/app-layout";
import { OwnerGuard } from "@/components/OwnerGuard";

import OwnerDashboard from "@/features/requests/pages/OwnerDashboard";
import Home from "@/pages/home";
import OwnerLoginPage from "@/pages/owner";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

export default function App() {
  return (
    <>
      <Toaster position="bottom-right" invert />
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />

          {/* owner auth page */}
          <Route path="/owner" element={<OwnerLoginPage />} />

          {/* ✅ protected owner routes */}
          <Route element={<OwnerGuard />}>
            <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}
