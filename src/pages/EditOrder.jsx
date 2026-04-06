import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById, updateOrder, getProducts } from "../services/orderService";
import { 
  User, Phone, MapPin, Truck, Hash, 
  Package, Plus, Trash2, Save, ArrowLeft,
  Search, IndianRupee, X 
} from "lucide-react";

export default function EditOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const suggestionRefs = useRef({});

  useEffect(() => {
    fetchOrder();
    fetchProducts();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const data = await getOrderById(id);
      // Ensure every item has the required properties for the search logic
      const hydratedItems = data.items.map(item => ({
        ...item,
        search: "",
        activeIndex: 0
      }));
      setOrder({ ...data, items: hydratedItems });
    } catch (err) {
      console.error("Failed to fetch order", err);
    }
  };

  const fetchProducts = async () => {
    const data = await getProducts();
    setProducts(data || []);
  };

  const calculateTotal = () => {
    if (!order) return 0;
    const itemsTotal = order.items.reduce((sum, item) => {
      const rate = item.rate || item.price || item.sellingPrice || 0;
      return sum + (item.quantity || 0) * rate;
    }, 0);

    return itemsTotal + (order.packingCharges || 0) + (order.otherCharges || 0) + (order.gstAmount || 0);
  };

  // Helper: Update a specific field in the items array
  const updateItemField = (index, field, value) => {
    const updatedItems = [...order.items];
    updatedItems[index][field] = value;
    setOrder({ ...order, items: updatedItems });
  };

  const addItem = () => {
    const newItem = { 
      productName: "", 
      quantity: 1, 
      rate: 0, 
      search: "", 
      activeIndex: 0 
    };
    setOrder({ ...order, items: [...order.items, newItem] });
  };

  const selectProduct = (p, index) => {
    const updatedItems = [...order.items];
    updatedItems[index].productName = p.name;
    updatedItems[index].rate = p.sellingPrice || 0;
    updatedItems[index].search = ""; // This closes the dropdown
    updatedItems[index].activeIndex = 0;
    setOrder({ ...order, items: updatedItems });
  };

  const handleKeyDown = (e, index, item) => {
    const searchTerm = (item.search || "").toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm));
    
    if (filtered.length === 0) return;

    let newIndex = item.activeIndex || 0;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      newIndex = (newIndex + 1) % filtered.length;
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      newIndex = (newIndex - 1 + filtered.length) % filtered.length;
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[newIndex]) {
        selectProduct(filtered[newIndex], index);
      }
      return;
    } else if (e.key === "Escape") {
      updateItemField(index, "search", "");
      return;
    }

    updateItemField(index, "activeIndex", newIndex);

    // Scroll suggestion into view
    setTimeout(() => {
      const el = suggestionRefs.current[`${index}-${newIndex}`];
      if (el) el.scrollIntoView({ block: "nearest", behavior: "auto" });
    }, 0);
  };

  if (!order) return <div className="p-10 text-center">Loading Order...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen pb-28">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-full border border-transparent hover:border-gray-200 transition-all">
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-2xl font-bold text-gray-800">Edit Order <span className="text-gray-400 font-normal">#{id}</span></h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Client Info Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="flex items-center gap-2 font-bold text-gray-700 mb-4"><User size={18}/> Client</h3>
              <div className="space-y-4">
                <Input label="Name" value={order.clientName} onChange={v => setOrder({...order, clientName: v})} />
                <Input label="Phone" value={order.clientPhone} onChange={v => setOrder({...order, clientPhone: v})} />
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">Address</label>
                  <textarea className="border rounded-xl p-3 text-sm focus:ring-2 ring-indigo-50 outline-none" rows="2" 
                    value={order.clientAddress} onChange={e => setOrder({...order, clientAddress: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="flex items-center gap-2 font-bold text-gray-700 mb-4"><Truck size={18}/> Logistics</h3>
              <Input label="Transport" value={order.transport} onChange={v => setOrder({...order, transport: v})} />
            </div>
          </div>

          {/* Items Table Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-visible">
              <div className="p-4 border-b flex justify-between items-center bg-gray-50/50">
                <span className="font-bold text-gray-700 flex items-center gap-2"><Package size={18}/> Order Items</span>
                <button onClick={addItem} className="flex items-center gap-1 text-sm font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-all">
                  <Plus size={16}/> Add New Item
                </button>
              </div>

              <div className="p-0">
                <table className="w-full">
                  <thead className="text-[10px] uppercase tracking-widest text-gray-400 border-b">
                    <tr>
                      <th className="p-4 text-left font-bold">Product Name</th>
                      <th className="p-4 text-center w-24">Qty</th>
                      <th className="p-4 text-left w-32">Rate</th>
                      <th className="p-4 text-right">Subtotal</th>
                      <th className="p-4 w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {order.items.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50/30 transition-colors">
                        <td className="p-4 relative">
                          <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                            <input
                              className="w-full pl-9 pr-8 py-2 border rounded-xl text-sm focus:border-indigo-500 outline-none transition-all"
                              placeholder="Search..."
                              value={item.productName || ""}
                              onChange={(e) => {
                                const updated = [...order.items];
                                updated[index].productName = e.target.value;
                                updated[index].search = e.target.value;
                                updated[index].activeIndex = 0;
                                setOrder({ ...order, items: updated });
                              }}
                              onKeyDown={(e) => handleKeyDown(e, index, item)}
                            />
                            {item.productName && (
                                <button 
                                    onClick={() => updateItemField(index, "productName", "")}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
                                >
                                    <X size={14} />
                                </button>
                            )}

                            {/* Dropdown Logic */}
                            {item.search && (
                              <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 shadow-2xl rounded-xl z-[100] max-h-52 overflow-y-auto">
                                {products
                                  .filter(p => p.name.toLowerCase().includes(item.search.toLowerCase()))
                                  .slice(0, 10)
                                  .map((p, i) => (
                                    <div
                                      key={p.id}
                                      ref={el => (suggestionRefs.current[`${index}-${i}`] = el)}
                                      className={`p-3 text-sm cursor-pointer flex justify-between items-center transition-all ${
                                        i === item.activeIndex ? "bg-indigo-600 text-white font-bold" : "hover:bg-indigo-50 text-gray-700"
                                      }`}
                                      onClick={() => selectProduct(p, index)}
                                    >
                                      <span>{p.name}</span>
                                      <span className={i === item.activeIndex ? "text-indigo-200" : "text-gray-400"}>₹{p.sellingPrice}</span>
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <input type="number" className="w-full border rounded-xl p-2 text-center text-sm outline-none focus:border-indigo-500"
                            value={item.quantity} onChange={(e) => updateItemField(index, 'quantity', Number(e.target.value))} />
                        </td>
                        <td className="p-4 text-sm">
                          <div className="flex items-center border rounded-xl px-2 focus-within:border-indigo-500">
                            <span className="text-gray-400">₹</span>
                            <input type="number" className="w-full p-2 outline-none text-sm"
                              value={item.rate || item.price || item.sellingPrice || 0} 
                              onChange={(e) => updateItemField(index, 'rate', Number(e.target.value))} />
                          </div>
                        </td>
                        <td className="p-4 text-right font-bold text-gray-700 text-sm">
                          ₹{((item.quantity || 0) * (item.rate || item.price || item.sellingPrice || 0)).toLocaleString()}
                        </td>
                        <td className="p-4">
                          <button onClick={() => {
                            const updated = order.items.filter((_, i) => i !== index);
                            setOrder({ ...order, items: updated });
                          }} className="text-gray-300 hover:text-red-500 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Footer Calculations */}
              <div className="p-6 bg-gray-50/50 border-t space-y-3">
                <div className="flex justify-end gap-10 text-sm text-gray-500">
                   <div className="flex flex-col items-end gap-2">
                        <span>Packing:</span>
                        <span>Other:</span>
                        <span>GST:</span>
                   </div>
                   <div className="flex flex-col items-end gap-1">
                        <input type="number" className="w-24 border rounded-lg px-2 py-1 text-right outline-none" value={order.packingCharges} onChange={e => setOrder({...order, packingCharges: Number(e.target.value)})} />
                        <input type="number" className="w-24 border rounded-lg px-2 py-1 text-right outline-none" value={order.otherCharges} onChange={e => setOrder({...order, otherCharges: Number(e.target.value)})} />
                        <input type="number" className="w-24 border rounded-lg px-2 py-1 text-right outline-none" value={order.gstAmount} onChange={e => setOrder({...order, gstAmount: Number(e.target.value)})} />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Bottom Bar */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl bg-gray-900 text-white rounded-2xl p-4 shadow-2xl flex items-center justify-between z-[200]">
            <div className="flex flex-col px-4">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Total Amount Payable</span>
                <span className="text-xl font-bold text-emerald-400 font-mono">₹{calculateTotal().toLocaleString()}</span>
            </div>
            <button 
                onClick={async () => {
                    await updateOrder(id, { ...order, total: calculateTotal() });
                    alert("Order Saved Successfully!");
                }}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-8 py-3 rounded-xl font-bold transition-all active:scale-95"
            >
                <Save size={18}/> Save Changes
            </button>
        </div>

      </div>
    </div>
  );
}

// Minimal Input Component
function Input({ label, value, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold text-gray-400 uppercase">{label}</label>
      <input
        className="border border-gray-200 rounded-xl p-2.5 text-sm focus:ring-2 ring-indigo-50 outline-none transition-all"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}