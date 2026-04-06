import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById, updateOrder, getProducts } from "../services/orderService";
import { 
  User, Phone, MapPin, Truck, Hash, 
  Package, Plus, Trash2, Save, ArrowLeft,
  Search, IndianRupee 
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
    const data = await getOrderById(id);
    // Ensure existing items have search state
    const hydratedItems = data.items.map(item => ({
      ...item,
      search: "",
      activeIndex: 0
    }));
    setOrder({ ...data, items: hydratedItems });
  };

  const fetchProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  const calculateTotal = () => {
    if (!order) return 0;
    let itemsTotal = order.items.reduce((sum, item) => {
      const rate = item.rate || item.price || item.sellingPrice || 0;
      return sum + (item.quantity || 0) * rate;
    }, 0);

    return (
      itemsTotal +
      (order.packingCharges || 0) +
      (order.otherCharges || 0) +
      (order.gstAmount || 0)
    );
  };

  if (!order) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans pb-32">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
              <ArrowLeft size={24} />
            </button>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Edit Order</h2>
              <p className="text-gray-500">Order ID: #{id}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Client & Transport Details */}
          <div className="lg:col-span-1 space-y-6">
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <User size={18} className="text-indigo-600" /> Client Details
              </h3>
              
              <div className="space-y-4">
                <FormInput label="Client Name" icon={<User size={16}/>} value={order.clientName} 
                  onChange={(v) => setOrder({...order, clientName: v})} />
                <FormInput label="Phone" icon={<Phone size={16}/>} value={order.clientPhone} 
                  onChange={(v) => setOrder({...order, clientPhone: v})} />
                <FormInput label="GST Number" icon={<Hash size={16}/>} value={order.gstNumber} 
                  onChange={(v) => setOrder({...order, gstNumber: v})} />

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1">
                    <MapPin size={12}/> Address
                  </label>
                  <textarea 
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    rows="3"
                    value={order.clientAddress || ""}
                    onChange={(e) => setOrder({...order, clientAddress: e.target.value})}
                  />
                </div>
              </div>
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Truck size={18} className="text-indigo-600" /> Transport
              </h3>
              <div className="space-y-4">
                <FormInput label="Transport Name" value={order.transport} 
                  onChange={(v) => setOrder({...order, transport: v})} />
                <FormInput label="Transport Address" value={order.transportAddress} 
                  onChange={(v) => setOrder({...order, transportAddress: v})} />
              </div>
            </section>
          </div>

          {/* Right: Items Table */}
          <div className="lg:col-span-2 space-y-6">
            {/* Added overflow-visible to prevent dropdown clipping */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-visible">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Package size={20} className="text-indigo-600" /> Items List
                </h3>
                <button 
                  onClick={() => {
                    const newItem = { productName: "", quantity: 1, rate: 0, search: "", activeIndex: 0 };
                    setOrder({ ...order, items: [...order.items, newItem] });
                  }}
                  className="flex items-center gap-2 text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors font-semibold text-sm"
                >
                  <Plus size={18} /> Add Item
                </button>
              </div>

              {/* overflow-x-auto removed from immediate wrapper to stop clipping dropdowns */}
              <div className="relative">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr className="text-xs font-bold text-gray-400 uppercase">
                      <th className="p-4 text-left">Product</th>
                      <th className="p-4 text-center w-24">Qty</th>
                      <th className="p-4 text-left w-32">Rate</th>
                      <th className="p-4 text-right">Amount</th>
                      <th className="p-4 text-center w-16"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {order.items.map((item, index) => (
                      <tr key={index} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 overflow-visible"> {/* Force visible */}
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input
                              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-indigo-500 outline-none"
                              placeholder="Type product name..."
                              value={item.productName || ""}
                              autoComplete="off"
                              onChange={(e) => {
                                const updatedItems = [...order.items];
                                updatedItems[index].productName = e.target.value;
                                updatedItems[index].search = e.target.value;
                                updatedItems[index].activeIndex = 0;
                                setOrder({ ...order, items: updatedItems });
                              }}
                              onKeyDown={(e) => handleKeyDown(e, index, item)}
                            />
                            
                            {/* Autocomplete Dropdown - Fixed CSS */}
                            {item.search && (
                              <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 shadow-2xl rounded-xl z-[100] max-h-60 overflow-y-auto ring-1 ring-black ring-opacity-5">
                                {products
                                  .filter((p) => p.name.toLowerCase().includes(item.search.toLowerCase()))
                                  .slice(0, 10)
                                  .map((p, i) => (
                                    <div
                                      key={p.id}
                                      ref={(el) => (suggestionRefs.current[`${index}-${i}`] = el)}
                                      className={`p-3 text-sm cursor-pointer flex justify-between items-center transition-all ${
                                        i === item.activeIndex ? "bg-indigo-600 text-white font-medium" : "hover:bg-indigo-50 text-gray-700"
                                      }`}
                                      onClick={() => selectProduct(p, index)}
                                    >
                                      <span>{p.name}</span>
                                      <span className={`text-xs ${i === item.activeIndex ? "text-indigo-100" : "text-gray-400"}`}>₹{p.sellingPrice}</span>
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4 align-top">
                          <input type="number" className="w-full border border-gray-200 rounded-lg p-2 text-center text-sm outline-none" 
                            value={item.quantity} onChange={(e) => updateItemField(index, 'quantity', Number(e.target.value))} />
                        </td>
                        <td className="p-4 align-top">
                          <div className="flex items-center gap-1">
                            <span className="text-gray-400">₹</span>
                            <input type="number" className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none" 
                              value={item.rate || item.price || item.sellingPrice || 0} onChange={(e) => updateItemField(index, 'rate', Number(e.target.value))} />
                          </div>
                        </td>
                        <td className="p-4 text-right font-mono font-bold text-gray-700 align-top pt-6">
                          ₹{((item.quantity || 0) * (item.rate || item.price || item.sellingPrice || 0)).toLocaleString()}
                        </td>
                        <td className="p-4 text-center align-top pt-4">
                          <button onClick={() => removeItem(index)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Charges Summary */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <IndianRupee size={18} className="text-indigo-600" /> Additional Charges
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormInput type="number" label="Packing Charges" value={order.packingCharges} 
                  onChange={(v) => setOrder({...order, packingCharges: Number(v)})} />
                <FormInput type="number" label="Other Charges" value={order.otherCharges} 
                  onChange={(v) => setOrder({...order, otherCharges: Number(v)})} />
                <FormInput type="number" label="GST Amount" value={order.gstAmount} 
                  onChange={(v) => setOrder({...order, gstAmount: Number(v)})} />
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Save Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl z-[110]">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Grand Total</span>
              <span className="text-2xl font-black text-emerald-600 font-mono">₹{calculateTotal().toLocaleString()}</span>
            </div>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200"
            >
              <Save size={20} /> Save Changes
            </button>
          </div>
        </div>

      </div>
    </div>
  );

  function updateItemField(index, field, value) {
    const updatedItems = [...order.items];
    updatedItems[index][field] = value;
    setOrder({ ...order, items: updatedItems });
  }

  function removeItem(index) {
    const updatedItems = order.items.filter((_, i) => i !== index);
    setOrder({ ...order, items: updatedItems });
  }

  function selectProduct(p, index) {
    const updatedItems = [...order.items];
    updatedItems[index].productName = p.name;
    updatedItems[index].rate = p.sellingPrice || 0;
    updatedItems[index].search = "";
    updatedItems[index].activeIndex = 0;
    setOrder({ ...order, items: updatedItems });
  }

  async function handleSave() {
    const updatedOrder = { ...order, total: calculateTotal() };
    await updateOrder(id, updatedOrder);
    alert("Order updated successfully!");
  }

  function handleKeyDown(e, index, item) {
    const searchTerm = (item.search || "").toLowerCase();
    const filtered = products.filter((p) => p.name.toLowerCase().includes(searchTerm));
    
    if (!filtered.length) return;
    let newIndex = item.activeIndex || 0;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      newIndex = (newIndex + 1) % filtered.length;
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      newIndex = (newIndex - 1 + filtered.length) % filtered.length;
    } else if (e.key === "Enter") {
      e.preventDefault();
      selectProduct(filtered[newIndex], index);
      return;
    } else if (e.key === "Escape") {
      updateItemField(index, "search", "");
      return;
    }

    const updatedItems = [...order.items];
    updatedItems[index].activeIndex = newIndex;
    setOrder({ ...order, items: updatedItems });

    // Ensure suggestion is visible in the dropdown scroll area
    setTimeout(() => {
      const el = suggestionRefs.current[`${index}-${newIndex}`];
      if (el) el.scrollIntoView({ block: "nearest", behavior: "auto" });
    }, 0);
  }
}

function FormInput({ label, value, onChange, icon, type = "text" }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1">
        {icon} {label}
      </label>
      <input
        type={type}
        className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}