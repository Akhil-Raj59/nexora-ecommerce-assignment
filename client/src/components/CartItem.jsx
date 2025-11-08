import React, { useState, useEffect } from "react";
import { Plus, Minus, Trash2 } from "lucide-react";

export default function CartItem({ item, onRemove, onUpdate }) {
  const [qty, setQty] = useState(item.quantity);

  useEffect(() => {
    setQty(item.quantity);
  }, [item.quantity]);

  const handleIncrement = () => {
    const newQty = qty + 1;
    setQty(newQty);
    onUpdate(item.product._id, newQty);
  };

  const handleDecrement = () => {
    if (qty > 1) {
      const newQty = qty - 1;
      setQty(newQty);
      onUpdate(item.product._id, newQty);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-4 sm:p-5 hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-3 sm:gap-4 flex-1 min-w-0">
          <img
            src={item.product.image || "https://via.placeholder.com/150"}
            alt={item.product.name}
            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg shadow-md flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2 mb-1">
              {item.product.name}
            </h4>
            <p className="text-blue-600 font-bold text-base sm:text-lg">
              ₹{item.product.price.toLocaleString('en-IN')}
            </p>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">
              Subtotal: ₹{(item.product.price * qty).toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 sm:gap-4">
          <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <button
              onClick={handleDecrement}
              disabled={qty <= 1}
              className="px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed active:bg-gray-200"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4 text-gray-700" />
            </button>
            <span className="w-12 text-center font-semibold text-gray-900 text-sm sm:text-base">
              {qty}
            </span>
            <button
              onClick={handleIncrement}
              className="px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors active:bg-gray-200"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4 text-gray-700" />
            </button>
          </div>

          <button
            onClick={() => onRemove(item.product._id)}
            className="group flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold transition-colors px-3 py-2 rounded-lg hover:bg-red-50 active:bg-red-100"
            aria-label="Remove item"
          >
            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="text-sm">Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
}