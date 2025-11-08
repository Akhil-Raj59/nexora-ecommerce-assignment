import React, { useEffect, useState, useContext } from "react";
import { getProducts, getCart, addToCart } from "../services/api";
import ProductCart from "../components/ProductCart";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Loader2 } from "lucide-react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: prodData } = await getProducts();
        setProducts(prodData.data);

        if (user) {
          const { data: cartData } = await getCart();
          const cartObj = {};
          cartData?.data?.items?.forEach((item) => {
            cartObj[item.product._id] = item.quantity;
          });
          setCart(cartObj);
        } else {
          setCart({});
        }
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleAddToCart = async (productId) => {
    if (!user) return navigate("/login");
    setAdding(productId);
    try {
      await addToCart(productId, 1);
      setCart((prev) => ({ ...prev, [productId]: 1 }));
    } catch (err) {
      console.error("Error adding to cart", err);
    } finally {
      setAdding("");
    }
  };

  const handleIncrement = async (productId) => {
    const newQty = cart[productId] + 1;
    await addToCart(productId, newQty);
    setCart((prev) => ({ ...prev, [productId]: newQty }));
  };

  const handleDecrement = async (productId) => {
    const newQty = cart[productId] - 1;
    if (newQty > 0) {
      await addToCart(productId, newQty);
      setCart((prev) => ({ ...prev, [productId]: newQty }));
    } else {
      const updated = { ...cart };
      delete updated[productId];
      setCart(updated);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          <p className="text-gray-600 font-medium">Loading products...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-10 sm:mb-12 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-3">
            Discover Our Products
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            Explore our curated collection of premium items
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {products.map((p, index) => (
            <div 
              key={p._id} 
              className="group relative animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2">
                <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 aspect-square">
                  {p.image && (
                    <>
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </>
                  )}
                  
                  {cart[p._id] && (
                    <button
                      onClick={() => navigate("/cart")}
                      className="absolute top-3 right-3 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 transform translate-x-0 opacity-100 transition-all duration-300 hover:scale-105"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span className="font-medium">View Cart</span>
                    </button>
                  )}
                </div>

                <div className="p-4 sm:p-5">
                  <ProductCart
                    product={p}
                    loading={adding === p._id}
                    inCart={!!cart[p._id]}
                    quantity={cart[p._id] || 0}
                    onAdd={() => handleAddToCart(p._id)}
                    onIncrement={() => handleIncrement(p._id)}
                    onDecrement={() => handleDecrement(p._id)}
                  />
                </div>
              </div>
            </div>
          ))}
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
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out both;
        }
      `}</style>
    </div>
  );
}