export default function Dashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Total Orders</p>
          <h3 className="text-2xl font-bold">120</h3>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Revenue</p>
          <h3 className="text-2xl font-bold">₹45,000</h3>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Low Stock</p>
          <h3 className="text-2xl font-bold">8 Items</h3>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Total Products</p>
          <h3 className="text-2xl font-bold">320</h3>
        </div>

      </div>

      {/* Charts Section */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-4">Sales Analytics</h3>
        <p className="text-gray-500">Chart coming soon...</p>
      </div>

    </div>
  );
}