import React from "react";
import { FiPlus, FiMinus } from "react-icons/fi";

export default function ProductCart({
  product,
  loading,
  inCart,
  quantity,
  onAdd,
  onIncrement,
  onDecrement,
}) {
  return (
    
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center justify-between">
      {/* {console.log(product)}
      <img
        src={product.image || "https://via.placeholder.com/150"}
        alt={product.name}
        className="w-32 h-32 object-cover rounded-md mb-3"
      /> */}
      <h3 className="font-semibold text-lg">{product.name}</h3>
      <p className="text-gray-600 mb-2">₹{product.price}</p>

      {inCart ? (
        <div className="flex items-center border rounded-md overflow-hidden">
          <button
            onClick={onDecrement}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 transition"
          >
            <FiMinus />
          </button>
          <span className="w-10 text-center">{quantity}</span>
          <button
            onClick={onIncrement}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 transition"
          >
            <FiPlus />
          </button>
        </div>
      ) : (
        <button
          onClick={onAdd}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md mt-2 hover:bg-blue-700 transition"
        >
          {loading ? "Adding..." : "Add to Cart"}
        </button>
      )}
    </div>
  );
}
