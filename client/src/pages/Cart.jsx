import React, { useEffect, useState } from "react";
import { getCart, removeFromCart, updateCartItem, clearCart } from "../services/api";
import CartItem from "../components/CartItem";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Trash2, ArrowRight, Loader2, ShoppingCart } from "lucide-react";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();

  const fetchCart = async () => {
    setLoading(true);
    try {
      const { data } = await getCart();
      setCart(data.data);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    setActionLoading(true);
    try {
      await removeFromCart(productId);
      fetchCart();
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setActionLoading(false);
    }
  };

 const handleUpdate = async (productId, quantity) => {
  if (quantity < 1) return; // prevent invalid
  // 1️⃣ Optimistically update UI
  setCart((prevCart) => {
    const updatedItems = prevCart.items.map((item) =>
      item.product._id === productId ? { ...item, quantity } : item
    );

    const updatedTotal = updatedItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    return { ...prevCart, items: updatedItems, totalAmount: updatedTotal };
  });

  // 2️⃣ Send update to backend (no full re-fetch)
  try {
    await updateCartItem(productId, quantity);
  } catch (error) {
    console.error("Failed to update quantity:", error);
    // optional: re-fetch if backend failed to sync
    fetchCart();
  }
};


  const handleClear = async () => {
    if (!confirm("Are you sure you want to clear your cart?")) return;
    setActionLoading(true);
    try {
      await clearCart();
      fetchCart();
    } catch (error) {
      console.error("Failed to clear cart:", error);
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          <p className="text-gray-600 font-medium">Loading your cart...</p>
        </div>
      </div>
    );

  if (!cart || !cart.items?.length)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full mb-6 shadow-lg">
            <ShoppingCart className="w-12 h-12 text-blue-600" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
            Your cart is empty
          </h3>
          <p className="text-gray-600 mb-8 text-sm sm:text-base">
            Looks like you haven't added anything yet
          </p>
          <button
            onClick={() => navigate("/products")}
            className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:shadow-xl transition-all duration-300 font-semibold flex items-center gap-2 mx-auto hover:scale-105"
          >
            <ShoppingBag className="w-5 h-5" />
            Start Shopping
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 sm:py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-10 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-2">
            Shopping Cart
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
        
        <div className="space-y-4 mb-6 animate-slide-up">
          {cart.items.map((item, index) => (
            <div 
              key={item.product._id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CartItem
                item={item}
                onRemove={handleRemove}
                onUpdate={handleUpdate}
              />
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <button
              onClick={handleClear}
              disabled={actionLoading}
              className="group flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Clear Cart
            </button>
            <div className="flex flex-col items-end">
              <span className="text-sm text-gray-600 mb-1">Total Amount</span>
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                ₹{cart.totalAmount?.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            disabled={actionLoading}
            className="group w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-xl hover:shadow-2xl transition-all duration-300 font-bold text-lg flex items-center justify-center gap-3 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Proceed to Checkout
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={() => navigate("/products")}
            className="w-full mt-3 text-blue-600 hover:text-blue-700 font-semibold py-3 transition-colors text-sm sm:text-base"
          >
            Continue Shopping
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out both;
        }
      `}</style>
    </div>
  );
}