export default function Topbar() {
  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
      
      <h1 className="text-xl font-semibold">Dashboard</h1>

      <div className="flex items-center gap-4">
        <span className="text-gray-600">Admin</span>
        <button className="bg-red-500 text-white px-4 py-1 rounded">
          Logout
        </button>
      </div>

    </div>
  );
}