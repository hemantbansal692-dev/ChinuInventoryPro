import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-lg p-4">
      
      <h2 className="text-2xl font-bold mb-6">Chinu Inventory</h2>

      <nav className="flex flex-col gap-3 text-gray-700">
        <Link to="/" className="hover:bg-gray-100 p-2 rounded">Dashboard</Link>
        <Link to="/orders" className="hover:bg-gray-100 p-2 rounded">Orders</Link>
        <Link to="/new-order" className="hover:bg-gray-100 p-2 rounded">New Order</Link>
        <Link to="/inventory" className="hover:bg-gray-100 p-2 rounded">Inventory</Link>
        <Link to="/purchase" className="hover:bg-gray-100 p-2 rounded">Purchase</Link>
        <Link to="/reports" className="hover:bg-gray-100 p-2 rounded">Reports</Link>
      </nav>

    </div>
  );
}