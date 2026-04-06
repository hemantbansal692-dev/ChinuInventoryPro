import { useEffect, useState } from "react";
import { getOrders } from "../services/orderService";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  ShoppingBag, 
  Calendar, 
  User, 
  Filter,
  ArrowUpRight
} from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders", err);
    }
  };

  // 🎨 Status Badge Helper
  const getStatusStyles = (status) => {
    const s = status?.toLowerCase();
    switch (s) {
      case "completed":
      case "delivered":
      case "paid":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "pending":
      case "processing":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "cancelled":
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // 🔍 Filter Logic
  const filteredOrders = orders.filter((order) =>
    order.clientName?.toLowerCase().includes(search.toLowerCase()) ||
    order.id?.toString().includes(search)
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Header Section --- */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Orders</h2>
            <p className="text-gray-500 mt-1">Track and manage client transactions.</p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search orders or clients..."
                className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-full md:w-64 shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 shadow-sm">
              <Filter size={20} />
            </button>
          </div>
        </header>

        {/* --- Table Container --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-600 text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold">Order Details</th>
                  <th className="p-4 font-semibold">Client</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Amount</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">View</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-12 text-center">
                      <div className="flex flex-col items-center">
                        <ShoppingBag className="text-gray-300 mb-3" size={48} />
                        <p className="text-gray-500 text-lg">No orders found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="group hover:bg-indigo-50/30 cursor-pointer transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-100 transition-colors">
                            <ShoppingBag size={18} />
                          </div>
                          <span className="font-bold text-gray-800">#{order.id}</span>
                        </div>
                      </td>
                      
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <User size={16} className="text-gray-400" />
                          <span className="font-medium">{order.clientName}</span>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <Calendar size={16} />
                          {order.orderDate
                            ? new Date(order.orderDate).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })
                            : "N/A"}
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="text-lg font-bold text-gray-900">
                          ₹{order.total?.toLocaleString() || "0"}
                        </span>
                      </td>

                      <td className="p-4">
                        {/* FIXED: Using dynamic status from order data */}
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusStyles(order.status)}`}>
                          {order.status || 'Unknown'}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <div className="inline-flex items-center justify-center p-2 text-gray-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 rounded-full transition-all">
                          <ArrowUpRight size={20} />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 bg-gray-50/50 border-t border-gray-100">
            <p className="text-xs text-gray-400 uppercase font-semibold">
              Showing {filteredOrders.length} transactions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}