import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById } from "../services/orderService";
import { generateInvoice } from "../utils/generateInvoice";
import { 
  ArrowLeft, 
  Download, 
  Edit3, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  Package, 
  Receipt 
} from "lucide-react";

export default function OrderDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const data = await getOrderById(id);
      setOrder(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Status Style Helper (Same as Orders page for consistency)
  const getStatusStyles = (status) => {
    const s = status?.toLowerCase();
    if (["completed", "delivered", "paid"].includes(s)) return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (["pending", "processing"].includes(s)) return "bg-amber-100 text-amber-800 border-amber-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* --- Navigation & Actions --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <button 
            onClick={() => navigate("/orders")}
            className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors w-fit"
          >
            <ArrowLeft size={20} />
            Back to Orders
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/orders/edit/${order.id}`)}
              className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 shadow-sm transition-all"
            >
              <Edit3 size={18} />
              Edit Order
            </button>
            <button
              onClick={() => generateInvoice(order)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 shadow-md transition-all font-medium"
            >
              <Download size={18} />
              Download Invoice
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* --- Left Column: Client Details --- */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User size={18} className="text-indigo-600" />
                Client Info
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase">Name</label>
                  <p className="text-gray-900 font-medium">{order.clientName}</p>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-gray-400 mt-1" />
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase">Phone</label>
                    <p className="text-gray-700">{order.clientPhone || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-gray-400 mt-1" />
                  <div>
                    <label className="text-xs font-semibold text-gray-400 uppercase">Address</label>
                    <p className="text-gray-700 text-sm leading-relaxed">{order.clientAddress}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Receipt size={18} className="text-indigo-600" />
                Order Meta
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Status</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusStyles(order.status)}`}>
                    {order.status || "Pending"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm flex items-center gap-1">
                    <Calendar size={14} /> Date
                  </span>
                  <span className="text-gray-900 font-medium text-sm">
                    {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* --- Right Column: Items & Totals --- */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center gap-2">
                <Package size={20} className="text-indigo-600" />
                <h3 className="text-lg font-bold text-gray-900">Order Items</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50">
                    <tr className="text-gray-500 text-xs uppercase tracking-wider">
                      <th className="p-4 font-semibold">Product</th>
                      <th className="p-4 font-semibold text-center">Qty</th>
                      <th className="p-4 font-semibold">Rate</th>
                      <th className="p-4 font-semibold text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {order.items.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 font-medium text-gray-800">{item.productName}</td>
                        <td className="p-4 text-center text-gray-600">{item.quantity}</td>
                        <td className="p-4 text-gray-600 font-mono text-sm">₹{item.sellingPrice}</td>
                        <td className="p-4 text-right font-semibold text-gray-900 font-mono">
                          ₹{(item.quantity * item.sellingPrice).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* --- Summary Section --- */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="space-y-3 w-full md:w-1/2 ml-auto">
                <div className="flex justify-between text-gray-500">
                  <span>Packing Charges</span>
                  <span className="font-mono">₹{order.packingCharges || 0}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Other Charges</span>
                  <span className="font-mono">₹{order.otherCharges || 0}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>GST Amount</span>
                  <span className="font-mono">₹{order.gstAmount || 0}</span>
                </div>
                <div className="h-px bg-gray-100 my-2"></div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xl font-bold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-black text-indigo-600 font-mono">
                    ₹{order.total?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}