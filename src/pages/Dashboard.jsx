import { useEffect, useState } from "react";
import { getOrders, getProducts } from "../services/orderService";
import { 
  ShoppingBag, 
  IndianRupee, 
  AlertTriangle, 
  Package, 
  TrendingUp,
  ArrowUpRight
} from "lucide-react";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, productsData] = await Promise.all([
          getOrders(),
          getProducts()
        ]);
        setOrders(ordersData || []);
        setProducts(productsData || []);
      } catch (err) {
        console.error("Dashboard data fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Dynamic Calculations
  const totalOrders = orders.length;
  
  const totalRevenue = orders.reduce((sum, order) => {
    // Uses the 'total' field if it exists, otherwise calculates from items
    return sum + (order.total || 0);
  }, 0);

  const lowStockItems = products.filter(p => (p.stock || 0) < 10).length;
  const totalProducts = products.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col mb-8">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h2>
          <p className="text-gray-500 mt-1 text-sm font-medium">Real-time business performance and stock alerts.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <StatCard 
            title="Total Orders" 
            value={totalOrders} 
            icon={<ShoppingBag className="text-indigo-600" size={24} />}
            color="bg-indigo-50"
          />

          <StatCard 
            title="Revenue" 
            value={`₹${totalRevenue.toLocaleString()}`} 
            icon={<IndianRupee className="text-emerald-600" size={24} />}
            color="bg-emerald-50"
          />

          <StatCard 
            title="Low Stock" 
            value={`${lowStockItems} Items`} 
            icon={<AlertTriangle className="text-amber-600" size={24} />}
            color="bg-amber-50"
            alert={lowStockItems > 0}
          />

          <StatCard 
            title="Total Products" 
            value={totalProducts} 
            icon={<Package className="text-blue-600" size={24} />}
            color="bg-blue-50"
          />

        </div>

        {/* Analytics Section Placeholder */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center min-h-[300px]">
            <div className="flex items-center justify-between w-full mb-6">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <TrendingUp size={20} className="text-indigo-500"/> Sales Analytics
                </h3>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Last 30 Days</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <div className="p-4 bg-gray-50 rounded-full">
                    <TrendingUp className="text-gray-300" size={40} />
                </div>
                <p className="text-gray-400 font-medium italic">Chart engine initializing...</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Recent Activity</h3>
            <div className="space-y-6">
              {orders.slice(0, 5).map((order, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-700">{order.clientName}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Order #{order.id?.slice(-5) || i}</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-gray-500">₹{order.total?.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, alert }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group cursor-default">
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-xl ${color} transition-transform group-hover:scale-110`}>
          {icon}
        </div>
        <ArrowUpRight size={16} className="text-gray-300 group-hover:text-indigo-400 transition-colors" />
      </div>
      <div className="mt-5">
        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">{title}</p>
        <h3 className={`text-2xl font-black ${alert ? 'text-amber-600' : 'text-gray-800'}`}>
          {value}
        </h3>
      </div>
    </div>
  );
}