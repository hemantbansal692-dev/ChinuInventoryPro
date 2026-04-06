import { useEffect, useState } from "react";
import { getProducts } from "../services/orderService";
// Note: You may need to install lucide-react: npm install lucide-react
import { Search, Plus, Package, AlertTriangle, IndianRupee, Edit3, Trash2 } from "lucide-react";

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  // 🔍 Filter Logic
  const filteredProducts = products.filter((p) =>
   (p.name || "").toLowerCase().includes(search.toLowerCase())
  );

  // 📊 Stats Calculation
  const totalProducts = products.length;
  const lowStock = products.filter((p) => p.quantity <= p.minStock).length;
  const inventoryValue = products.reduce(
    (sum, p) => sum + p.quantity * p.purchasePrice,
    0
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Inventory Management</h2>
            <p className="text-gray-500 mt-1">Monitor and manage your stock levels efficiently.</p>
          </div>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm">
            <Plus size={20} />
            Add Product
          </button>
        </header>

        {/* 📊 Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Total Products" 
            value={totalProducts} 
            icon={<Package className="text-blue-600" />} 
            color="bg-blue-50" 
          />
          <StatCard 
            title="Low Stock Alert" 
            value={lowStock} 
            icon={<AlertTriangle className="text-amber-600" />} 
            color="bg-amber-50"
            textColor={lowStock > 0 ? "text-red-600" : "text-gray-900"}
          />
          <StatCard 
            title="Inventory Value" 
            value={`₹${inventoryValue.toLocaleString()}`} 
            icon={<IndianRupee className="text-emerald-600" />} 
            color="bg-emerald-50" 
          />
        </div>

        {/* 🔍 Search & Table Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by product name..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-600 text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold">Product Details</th>
                  <th className="p-4 font-semibold text-center">In Stock</th>
                  <th className="p-4 font-semibold text-center">Min Stock</th>
                  <th className="p-4 font-semibold">Pricing (Buy/Sell)</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((p) => {
                  const isLow = p.quantity <= p.minStock;

                  return (
                    <tr key={p.id} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="p-4">
                        <div className="font-bold text-gray-800">{p.name}</div>
                        <div className="text-xs text-gray-400">ID: #{p.id.toString().slice(-4)}</div>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`font-mono font-medium ${isLow ? 'text-red-600' : 'text-gray-700'}`}>
                          {p.quantity}
                        </span>
                      </td>
                      <td className="p-4 text-center text-gray-500 font-mono">{p.minStock}</td>
                      <td className="p-4">
                        <div className="text-sm text-gray-600">P: ₹{p.purchasePrice}</div>
                        <div className="text-sm font-semibold text-indigo-600">S: ₹{p.sellingPrice}</div>
                      </td>
                      <td className="p-4">
                        {isLow ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            In Stock
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                            <Edit3 size={18} />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="py-12 text-center">
              <Package className="mx-auto text-gray-300 mb-3" size={48} />
              <p className="text-gray-500">No products match your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Sub-component for Stats to keep code clean
function StatCard({ title, value, icon, color, textColor = "text-gray-900" }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className={`text-2xl font-bold ${textColor}`}>{value}</h3>
      </div>
    </div>
  );
}