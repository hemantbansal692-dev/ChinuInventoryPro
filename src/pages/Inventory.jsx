import { useEffect, useState } from "react";
import { getProducts } from "../services/orderService";

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

  // 🔍 Filter
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // 📊 Stats
  const totalProducts = products.length;
  const lowStock = products.filter(p => p.quantity <= p.minStock).length;
  const inventoryValue = products.reduce(
    (sum, p) => sum + (p.quantity * p.purchasePrice),
    0
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Inventory</h2>

      {/* 🔍 Top Bar */}
      <div className="flex justify-between mb-6">
        <input
          type="text"
          placeholder="Search products..."
          className="border p-2 w-1/3 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          + Add Product
        </button>
      </div>

      {/* 📊 Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Total Products</p>
          <h3 className="text-xl font-bold">{totalProducts}</h3>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Low Stock</p>
          <h3 className="text-xl font-bold text-red-500">{lowStock}</h3>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-500">Inventory Value</p>
          <h3 className="text-xl font-bold text-green-600">
            ₹{inventoryValue}
          </h3>
        </div>
      </div>

      {/* 📦 Table */}
      <div className="bg-white rounded-xl shadow p-4">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="p-3">Name</th>
              <th className="p-3">Qty</th>
              <th className="p-3">Min</th>
              <th className="p-3">Purchase</th>
              <th className="p-3">Selling</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((p) => {
              const isLow = p.quantity <= p.minStock;

              return (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-semibold">{p.name}</td>
                  <td className="p-3">{p.quantity}</td>
                  <td className="p-3">{p.minStock}</td>
                  <td className="p-3">₹{p.purchasePrice}</td>
                  <td className="p-3">₹{p.sellingPrice}</td>

                  {/* Status */}
                  <td className="p-3">
                    {isLow ? (
                      <span className="text-red-500 font-semibold">
                        Low Stock
                      </span>
                    ) : (
                      <span className="text-green-600">OK</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="p-3 flex gap-2">
                    <button className="bg-yellow-400 px-2 py-1 rounded">
                      Edit
                    </button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded">
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            No products found
          </p>
        )}
      </div>
    </div>
  );
}