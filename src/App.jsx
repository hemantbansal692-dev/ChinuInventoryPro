import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layout/MainLayout";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import EditOrder from "./pages/EditOrder";
import Inventory from "./pages/Inventory";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* ✅ Public Route */}
        <Route path="/" element={<LandingPage />} />

        {/* ✅ App Routes (with layout) */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
          <Route path="/orders/edit/:id" element={<EditOrder />} />
          <Route path="/inventory" element={<Inventory />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}