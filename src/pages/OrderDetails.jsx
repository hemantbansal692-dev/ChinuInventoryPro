import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "../services/orderService";
import { generateInvoice } from "../utils/generateInvoice";
import { useNavigate } from "react-router-dom";


export default function OrderDetails() {
    const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const data = await getOrderById(id);
      setOrder(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!order) return <p>Loading...</p>;

  return (
        <div>
        <div className="flex justify-between items-center mb-6">
    
    <h2 className="text-2xl font-bold">Order Details</h2>

    <div className="flex gap-3">
        
        {/* Edit Button */}
        <button
        onClick={() => navigate(`/orders/edit/${order.id}`)}
        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
        Edit Order
        </button>

        {/* Download Button */}
        <button
        onClick={() => generateInvoice(order)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
        Download Invoice
        </button>

    </div>
    </div>

      {/* Client Info */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <p><b>Client:</b> {order.clientName}</p>
        <p><b>Phone:</b> {order.clientPhone}</p>
        <p><b>Address:</b> {order.clientAddress}</p>
        <p><b>Date:</b> {order.createdAt}</p>
      </div>

      {/* Items Table */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h3 className="font-semibold mb-4">Items</h3>

        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-2">Product</th>
              <th className="p-2">Qty</th>
              <th className="p-2">Rate</th>
              <th className="p-2">Amount</th>
            </tr>
          </thead>

          <tbody>
            {order.items.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">{item.productName}</td>
                <td className="p-2">{item.quantity}</td>
                <td className="p-2">₹{item.sellingPrice}</td>
                <td className="p-2">
                  ₹{item.quantity * item.sellingPrice}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Charges */}
      <div className="bg-white p-4 rounded-xl shadow">
        <p>Packing: ₹{order.packingCharges}</p>
        <p>Other: ₹{order.otherCharges}</p>
        <p>GST: ₹{order.gstAmount}</p>

        <hr className="my-2" />

        <h3 className="text-xl font-bold">
          Total: ₹{order.total}
        </h3>
      </div>
    </div>
  );
}