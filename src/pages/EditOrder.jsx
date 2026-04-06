import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById, updateOrder, getProducts } from "../services/orderService";
import { 
  User, Phone, MapPin, Truck, Hash, 
  Package, Plus, Trash2, Save, ArrowLeft,
  Search, IndianRupee, X, MapPinned
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

  const updateItemField = (index, field, value) => {
    const updatedItems = [...order.items];
    updatedItems[index][field] = value;
    setOrder({ ...order, items: updatedItems });
  };

  const addItem = () => {
    const newItem = { productName: "", quantity: 1, rate: 0, search: "", activeIndex: 0 };
    setOrder({ ...order, items: [...order.items, newItem] });
  };

  const selectProduct = (p, index) => {
    const updatedItems = [...order.items];
    updatedItems[index].productName = p.name;
    updatedItems[index].rate = p.sellingPrice || 0;
    updatedItems[index].search = "";
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
      if (filtered[newIndex]) selectProduct(filtered[newIndex], index);
      return;
    }
    updateItemField(index, "activeIndex", newIndex);
  };

  if (!order) return <div className="p-10 text-center font-sans text-gray-500">Loading Order Data...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans pb-12">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Top Header --- */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-all shadow-sm">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit Order Details</h2>
              <p className="text-sm text-gray-500">Manage items and shipping for Order #{id}</p>
            </div>
          </div>
          <button 
            onClick={async () => {
              await updateOrder(id, { ...order, total: calculateTotal() });
              alert("Changes saved successfully!");
            }}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95"
          >
            <Save size={18}/> Save Changes
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- LEFT: CLIENT & LOGISTICS (4 Cols) --- */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-6 border-b pb-4"><User size={18} className="text-indigo-600"/> Client Information</h3>
              <div className="space-y-5">
                <FormInput label="Client Name" value={order.clientName} onChange={v => setOrder({...order, clientName: v})} />
                <FormInput label="Phone Number" value={order.clientPhone} onChange={v => setOrder({...order, clientPhone: v})} />
                <FormInput label="GST Number" value={order.gstNumber} onChange={v => setOrder({...order, gstNumber: v})} icon={<Hash size={14}/>}/>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Client Address</label>
                  <textarea className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 ring-indigo-50 outline-none transition-all" rows="2" 
                    value={order.clientAddress} onChange={e => setOrder({...order, clientAddress: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-6 border-b pb-4"><Truck size={18} className="text-indigo-600"/> Shipping & Transport</h3>
              <div className="space-y-5">
                <FormInput label="Transport Name" value={order.transport} onChange={v => setOrder({...order, transport: v})} />
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1"><MapPinned size={14}/> Transport Address</label>
                  <textarea className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 ring-indigo-50 outline-none transition-all" rows="2" 
                    value={order.transportAddress} onChange={e => setOrder({...order, transportAddress: e.target.value})} />
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT: ORDER ITEMS (8 Cols) --- */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-5 border-b flex justify-between items-center bg-gray-50/50">
                <span className="font-bold text-gray-800 flex items-center gap-2"><Package size={18} className="text-indigo-600"/> Order Items</span>
                <button onClick={addItem} className="flex items-center gap-1 text-sm font-bold text-indigo-600 hover:bg-white border border-transparent hover:border-indigo-100 px-4 py-2 rounded-xl transition-all">
                  <Plus size={16}/> Add Item
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/30 text-[10px] uppercase tracking-widest text-gray-400 border-b border-gray-100">
                    <tr>
                      <th className="p-4 text-left">Product Details</th>
                      <th className="p-4 text-center w-28">Quantity</th>
                      <th className="p-4 text-left w-36">Rate</th>
                      <th className="p-4 text-right">Subtotal</th>
                      <th className="p-4 w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {order.items.map((item, index) => (
                      <tr key={index} className="hover:bg-indigo-50/20 transition-colors">
                        <td className="p-4 relative">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                            <input
                              className="w-full pl-9 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-2 ring-indigo-50 outline-none transition-all"
                              placeholder="Search products..."
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
                            {item.search && (
                              <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 shadow-xl rounded-xl z-[100] max-h-56 overflow-y-auto">
                                {products
                                  .filter(p => p.name.toLowerCase().includes(item.search.toLowerCase()))
                                  .slice(0, 10)
                                  .map((p, i) => (
                                    <div
                                      key={p.id}
                                      ref={el => (suggestionRefs.current[`${index}-${i}`] = el)}
                                      className={`p-3 text-sm cursor-pointer flex justify-between items-center transition-all ${
                                        i === item.activeIndex ? "bg-indigo-600 text-white font-bold" : "hover:bg-gray-50 text-gray-700"
                                      }`}
                                      onClick={() => selectProduct(p, index)}
                                    >
                                      <span>{p.name}</span>
                                      <span className="text-[10px] opacity-70 font-mono font-normal">₹{p.sellingPrice}</span>
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <input type="number" className="w-full border border-gray-200 rounded-xl p-2.5 text-center text-sm outline-none focus:border-indigo-500"
                            value={item.quantity} onChange={(e) => updateItemField(index, 'quantity', Number(e.target.value))} />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center border border-gray-200 rounded-xl px-3 focus-within:border-indigo-500 focus-within:ring-2 ring-indigo-50 transition-all">
                            <span className="text-gray-400 text-xs mr-1">₹</span>
                            <input type="number" className="w-full py-2.5 outline-none text-sm font-mono"
                              value={item.rate || item.price || item.sellingPrice || 0} 
                              onChange={(e) => updateItemField(index, 'rate', Number(e.target.value))} />
                          </div>
                        </td>
                        <td className="p-4 text-right font-bold text-gray-800 text-sm font-mono">
                          ₹{((item.quantity || 0) * (item.rate || item.price || item.sellingPrice || 0)).toLocaleString()}
                        </td>
                        <td className="p-4 text-center">
                          <button onClick={() => {
                            const updated = order.items.filter((_, i) => i !== index);
                            setOrder({ ...order, items: updated });
                          }} className="text-gray-300 hover:text-red-500 transition-colors p-2">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* --- Billing Summary (Integrated) --- */}
              <div className="p-8 bg-gray-50/30 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Adjustments</p>
                     <div className="grid grid-cols-3 gap-4">
                        <SmallInput label="Packing" value={order.packingCharges} onChange={v => setOrder({...order, packingCharges: Number(v)})} />
                        <SmallInput label="Other" value={order.otherCharges} onChange={v => setOrder({...order, otherCharges: Number(v)})} />
                        <SmallInput label="GST Val" value={order.gstAmount} onChange={v => setOrder({...order, gstAmount: Number(v)})} />
                     </div>
                  </div>
                  <div className="flex flex-col items-end justify-end">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Grand Total Amount</span>
                    <span className="text-3xl font-black text-indigo-600 font-mono tracking-tight">₹{calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Input Sub-components
function FormInput({ label, value, onChange, icon }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
        {icon} {label}
      </label>
      <input
        className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:ring-2 ring-indigo-50 outline-none transition-all font-medium text-gray-700"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function SmallInput({ label, value, onChange }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">{label}</label>
      <div className="relative">
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]">₹</span>
        <input
          type="number"
          className="w-full border border-gray-200 rounded-lg pl-5 pr-2 py-1.5 text-xs font-mono outline-none focus:border-indigo-500 bg-white"
          value={value || 0}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}