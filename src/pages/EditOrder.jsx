import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderById } from "../services/orderService";
import { updateOrder } from "../services/orderService";
import { getProducts } from "../services/orderService";
import { useRef } from "react";

export default function EditOrder() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const suggestionRefs = useRef({});

  useEffect(() => {
    fetchOrder();
    fetchProducts();

  }, []);

  const fetchOrder = async () => {
    const data = await getOrderById(id);
    setOrder(data);
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

  if (!order) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Edit Order</h2>

            {/* Client Info */}
            <div className="bg-white p-4 rounded-xl shadow mb-6">

                <h3 className="font-semibold mb-4">Client Details</h3>

                <div className="grid grid-cols-3 gap-4 items-center">

                    {/* Client Name */}
            <div className="flex items-center gap-2">
            <span className="text-sm whitespace-nowrap">Client:</span>
            <input
                className="border p-2 w-full"
                value={order.clientName || ""}
                onChange={(e) =>
                setOrder({ ...order, clientName: e.target.value })
                }
            />
            </div>

            {/* Phone */}
            <div className="flex items-center gap-2">
                <span className="text-sm whitespace-nowrap">Phone:</span>
                <input
                    className="border p-2 w-full"
                    value={order.clientPhone || ""}
                    onChange={(e) =>
                    setOrder({ ...order, clientPhone: e.target.value })
                    }
                />
            </div>

            {/* GST */}
            <div className="flex items-center gap-2">
                <span className="text-sm whitespace-nowrap">GST:</span>
                <input
                    className="border p-2 w-full"
                    value={order.gstNumber || ""}
                    onChange={(e) =>
                    setOrder({ ...order, gstNumber: e.target.value })
                    }
                />
            </div>

            {/* Address */}
            <div className="flex items-center gap-2 col-span-2">
                <span className="text-sm whitespace-nowrap">Address:</span>
                <input
                    className="border p-2 w-full"
                    value={order.clientAddress || ""}
                    onChange={(e) =>
                    setOrder({ ...order, clientAddress: e.target.value })
                    }
                />
            </div>

            {/* Transport */}
                <div className="flex items-center gap-2">
                <span className="text-sm whitespace-nowrap">Transport:</span>
                <input
                    className="border p-2 w-full"
                    value={order.transport || ""}
                    onChange={(e) =>
                    setOrder({ ...order, transport: e.target.value })
                    }
                />
            </div>

            {/* Transport Address */}
            <div className="flex items-center gap-2 col-span-3">
                <span className="text-sm whitespace-nowrap">Transport Addr:</span>
                <input
                    className="border p-2 w-full"
                    value={order.transportAddress || ""}
                    onChange={(e) =>
                    setOrder({ ...order, transportAddress: e.target.value })
                    }
                />
            </div>



        </div>

      </div>
      <div className="bg-white p-4 rounded-xl shadow mb-6">
  <h3 className="font-semibold mb-4">Items</h3>

  <div className="grid grid-cols-5 gap-3 mb-2 font-semibold text-sm text-gray-600">
  <div>Product</div>
  <div>Qty</div>
  <div>Rate</div>
  <div>Amount</div>
  <div>Action</div>
</div>

  {order.items.map((item, index) => {
    const rate = item.rate || item.price || item.sellingPrice || 0;

    return (
      <div key={index} className="grid grid-cols-5 gap-3 mb-3">

        {/* Product Name */}
        <div className="relative">

            <input
                className="border p-2 w-full"
                placeholder="Search product..."
                value={item.productName || ""}
                onChange={(e) => {
                const updatedItems = [...order.items];
                updatedItems[index].productName = e.target.value;
                updatedItems[index].search = e.target.value;
                updatedItems[index].activeIndex = 0;
                setOrder({ ...order, items: updatedItems });
                }}

                onKeyDown={(e) => {
                    const filtered = products.filter((p) =>
                        p.name.toLowerCase().includes((item.search || "").toLowerCase())
                    );

                    if (!filtered.length) return;

                    let newIndex = item.activeIndex || 0;

                    // ⬇️ DOWN
                    if (e.key === "ArrowDown") {
                        e.preventDefault();
                        newIndex = (newIndex + 1) % filtered.length;
                    }

                    // ⬆️ UP
                    if (e.key === "ArrowUp") {
                        e.preventDefault();
                        newIndex = (newIndex - 1 + filtered.length) % filtered.length;
                    }

                    // ⏎ ENTER
                    if (e.key === "Enter") {
                        e.preventDefault();
                        const selected = filtered[newIndex];

                        const updatedItems = [...order.items];
                        updatedItems[index].productName = selected.name;
                        updatedItems[index].rate = selected.sellingPrice || 0;
                        updatedItems[index].search = "";
                        updatedItems[index].activeIndex = 0;

                        setOrder({ ...order, items: updatedItems });
                        return;
                    }

                    // update index
                    const updatedItems = [...order.items];
                    updatedItems[index].activeIndex = newIndex;
                    setOrder({ ...order, items: updatedItems });

                    // ✅ SCROLL AFTER UPDATE
                    setTimeout(() => {
                        const el = suggestionRefs.current[`${index}-${newIndex}`];
                        if (el) {
                        el.scrollIntoView({
                            block: "nearest",
                            behavior: "auto"
                        });
                        }
                    }, 0);
                }}
            />

            {/* Suggestions */}
            {item.search && (
                <div className="absolute bg-white border w-full max-h-40 overflow-y-auto z-10">
                {products
                    .filter((p) =>
                    p.name.toLowerCase().includes(item.search.toLowerCase())
                    )
                    .slice(0, 5)
                    .map((p, i) => (
                    <div
                        key={p.id}
                        ref={(el) => {
                            suggestionRefs.current[`${index}-${i}`] = el;
                        }}
                        className={`p-2 cursor-pointer ${
                        i === item.activeIndex ? "bg-blue-100" : "hover:bg-gray-100"
                        }`}
                        onClick={() => {
                        const updatedItems = [...order.items];
                        updatedItems[index].productName = p.name;
                        updatedItems[index].rate = p.sellingPrice || 0;
                        updatedItems[index].search = "";
                        updatedItems[index].activeIndex = 0;

                        setOrder({ ...order, items: updatedItems });
                        }}
                    >
                        {p.name} (₹{p.sellingPrice})
                    </div>
                    ))}
                </div>
            )}

        </div>

        {/* Quantity */}
        <input
          type="number"
          className="border p-2"
          value={item.quantity}
          onChange={(e) => {
            const updatedItems = [...order.items];
            updatedItems[index].quantity = Number(e.target.value);
            setOrder({ ...order, items: updatedItems });
          }}
        />

        {/* Rate */}
        <input
          type="number"
          className="border p-2"
          value={rate}
          onChange={(e) => {
            const updatedItems = [...order.items];
            updatedItems[index].rate = Number(e.target.value);
            setOrder({ ...order, items: updatedItems });
          }}
        />

        {/* Amount */}
        <div className="flex items-center">
          ₹{item.quantity * rate}
        </div>
          
        <button
            onClick={() => {
                const updatedItems = order.items.filter((_, i) => i !== index);
                setOrder({ ...order, items: updatedItems });
            }}
            className="bg-red-500 text-white px-2 py-1 rounded"
            >
            ❌
        </button>

        

      </div>
      

      
    );
  })}

    <button
    onClick={() => {
        const newItem = {
        productName: "",
        quantity: 1,
        rate: 0
        };

        setOrder({
        ...order,
        items: [...order.items, newItem]
        });
    }}
    className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
    >
    + Add Item
    </button>

     <div className="bg-white p-4 rounded-xl shadow mb-6">

  <div className="grid grid-cols-4 gap-4 items-center">

            <div className="flex items-center gap-2">
            <span className="text-sm">Packing:</span>
            <input
                type="number"
                className="border p-2 w-full"
                value={order.packingCharges || 0}
                onChange={(e) =>
                setOrder({ ...order, packingCharges: Number(e.target.value) })
                }
            />
            </div>

            <div className="flex items-center gap-2">
            <span className="text-sm">Other:</span>
            <input
                type="number"
                className="border p-2 w-full"
                value={order.otherCharges || 0}
                onChange={(e) =>
                setOrder({ ...order, otherCharges: Number(e.target.value) })
                }
            />
            </div>

            <div className="flex items-center gap-2">
            <span className="text-sm">GST:</span>
            <input
                type="number"
                className="border p-2 w-full"
                value={order.gstAmount || 0}
                onChange={(e) =>
                setOrder({ ...order, gstAmount: Number(e.target.value) })
                }
            />
            </div>

            {/* Total */}
            <div className="text-right font-bold text-green-600">
            Total: ₹{calculateTotal()}
            </div>

        </div>

    </div>

    <div className="bg-white p-4 rounded-xl shadow mb-6">
       <h3 className="text-xl font-bold text-green-600">
            Total Amount: ₹{calculateTotal()}
        </h3>
    </div>
    
    
</div>



      {/* Save Button */}
        <button
            onClick={async () => {
            const updatedOrder = {
                ...order,
                total: calculateTotal()
            };

            await updateOrder(id, updatedOrder);
            alert("Order updated!");
            
            }}
            className="bg-green-600 text-white px-6 py-2 rounded"
            >
            Save Changes
        </button>
    </div>
  );
}