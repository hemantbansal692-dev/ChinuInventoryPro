import { useEffect, useState } from "react";
import { getOrders } from "../services/orderService";
import { useNavigate } from "react-router-dom";

export default function Orders() {
  const [orders, setOrders] = useState([]);
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

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Orders</h2>

      <div className="bg-white rounded-xl shadow p-4">
        
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-3">Order ID</th>
              <th className="p-3">Client Name</th>
              <th className="p-3">Total Amount</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td className="p-3">No orders found</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                key={order.id}
                onClick={() => navigate(`/orders/${order.id}`)}
                className="border-b hover:bg-gray-50 cursor-pointer">
                        <td className="p-3 font-semibold">{order.id}</td>
                    <td className="p-3">{order.clientName}</td>
                    <td className="p-3 text-green-600 font-semibold">₹{order.total}</td>
                    <td className="p-3 text-gray-500">
                        {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                </tr>
              ))
            )}
          </tbody>

        </table>

      </div>
    </div>
  );
}