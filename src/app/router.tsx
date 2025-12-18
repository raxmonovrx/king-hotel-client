import { AppLayout } from "@/components/layout/app-layout";
import Home from "@/pages/home";
import OwnerLoginPage from "@/pages/owner";

import { Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="/owner" element={<OwnerLoginPage />} />
      </Route>
    </Routes>
  );
}
