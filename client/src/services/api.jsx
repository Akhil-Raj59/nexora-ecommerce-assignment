import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:8000",
//   headers: { "Content-Type": "application/json" },
//   withCredentials: true, // Important for cookies if using them
// });

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://192.168.51.56:8000",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // if using cookies or auth
});

// Request interceptor: Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle token refresh on 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const { data } = await axios.post(
            "http://localhost:8000/api/v1/users/refresh-token",
            { refreshToken }
          );

          // Update token
          localStorage.setItem("accessToken", data.data.accessToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ==========================================
// USER AUTHENTICATION APIs (Bonus Feature)
// ==========================================
export const registerUser = (formData) => {
  // formData because of file upload (avatar)
  return api.post("/api/v1/users/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const loginUser = (data) => api.post("/api/v1/users/login", data);

export const logoutUser = () => api.post("/api/v1/users/logout");

export const refreshToken = (token) =>
  api.post("/api/v1/users/refresh-token", { refreshToken: token });

export const getCurrentUser = () => api.get("/api/v1/users/me");

// ==========================================
// CORE E-COMMERCE APIs (Assignment Requirements)
// ==========================================

// Products
export const getProducts = () => api.get("/api/products");

// Cart
export const getCart = () => api.get("/api/cart");

export const addToCart = (productId, quantity = 1) =>
  api.post("/api/cart/add", { productId, quantity });

export const updateCartItem = (productId, quantity) =>
  api.put("/api/cart/update", { productId, quantity });
 
export const removeFromCart = (productId) =>
  api.delete(`/api/cart/remove/${productId}`);

export const clearCart = () => api.delete("/api/cart/clear");

// Checkout
export const checkout = (checkoutData) =>
  api.post("/api/checkout", checkoutData);

export default api;