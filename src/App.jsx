import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import EditOrder from "./pages/EditOrder";
import Inventory from "./pages/Inventory";



export default function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
          <Route path="/orders/edit/:id" element={<EditOrder />} />
          <Route path="/Inventory" element={<Inventory />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}