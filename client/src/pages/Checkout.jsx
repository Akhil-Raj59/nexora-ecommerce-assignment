import React, { useState, useEffect } from "react";
import { getCart, checkout } from "../services/api";

export default function Checkout() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [cart, setCart] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      const { data } = await getCart();
      setCart(data.data);
    };
    fetchCart();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await checkout(form);
      setReceipt(data.data);
      console.log("Checkout successful:", data.data);
    } catch {
      console.error("Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  if (receipt)
    return (
      <div className="max-w-md mx-auto text-center bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-green-600">Order Successful!</h2>
        <p className="text-gray-700">Order ID: {receipt.userid || 234985409}</p>
        <p className="text-gray-700">Total: ₹{receipt.total}</p>
        <p className="text-gray-500 mt-2">Status:{receipt.status || "confirmed"}</p>
        <p className="text-sm mt-4">Timestamp: {new Date().toLocaleString()}</p>
      </div>
    );

  if (!cart)
    return <div className="text-center py-10 text-gray-600">Loading checkout...</div>;

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Checkout</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="border rounded-md px-3 py-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="border rounded-md px-3 py-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? "Processing..." : "Place Order"}
        </button>
      </form>
      <div className="mt-4 text-right text-gray-700 font-medium">
        Total: ₹{cart.totalAmount}
      </div>
    </div>
  );
}
