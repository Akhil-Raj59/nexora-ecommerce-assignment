import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";

// Utility function to recalculate totalAmount
const calculateTotal = (cart) => {
  return cart.items.reduce((sum, item) => {
    const price = Number(item.product?.price || item.price || 0);
    const qty = Number(item.quantity || 0);
    return sum + price * qty;
  }, 0);
};

export const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity <= 0) {
    throw new ApiError(400, "Product ID and valid quantity are required");
  }

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");

  let cart = await Cart.findOne({ user: userId }).populate("items.product", "name price image");

  if (!cart) {
    cart = new Cart({
      user: userId,
      items: [{ product: productId, quantity, price: product.price }],
    });
  } else {
    const itemIndex = cart.items.findIndex(
      (item) => item.product._id.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity, price: product.price });
    }
  }

  cart.totalAmount = calculateTotal(cart);
  await cart.save();

  const updatedCart = await Cart.findOne({ user: userId }).populate("items.product", "name price image");

  res.status(200).json(new ApiResponse(200, updatedCart, "Product added to cart successfully"));
});


export const getCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const cart = await Cart.findOne({ user: userId }).populate("items.product", "name price image");

  if (!cart) throw new ApiError(404, "Cart not found");

  cart.totalAmount = calculateTotal(cart);
  await cart.save();

  res.status(200).json(new ApiResponse(200, cart, "Cart fetched successfully"));
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;

  if (!productId || quantity === undefined)
    throw new ApiError(400, "Product ID and quantity are required");

  const cart = await Cart.findOne({ user: userId }).populate("items.product", "name price image");
  if (!cart) throw new ApiError(404, "Cart not found");

  const itemIndex = cart.items.findIndex(
    (item) => item.product._id.toString() === productId
  );

  if (itemIndex === -1) throw new ApiError(404, "Product not in cart");

  if (quantity <= 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity = quantity;
  }

  cart.totalAmount = calculateTotal(cart);
  await cart.save();

  res.status(200).json(new ApiResponse(200, cart, "Cart item updated successfully"));
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: userId }).populate("items.product", "name price image");
  if (!cart) throw new ApiError(404, "Cart not found");

  cart.items = cart.items.filter((item) => item.product._id.toString() !== productId);

  cart.totalAmount = calculateTotal(cart);
  await cart.save();

  res.status(200).json(new ApiResponse(200, cart, "Product removed from cart successfully"));
});

export const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const cart = await Cart.findOne({ user: userId });

  if (!cart) throw new ApiError(404, "Cart not found");

  cart.items = [];
  cart.totalAmount = 0;
  await cart.save();

  res.status(200).json(new ApiResponse(200, cart, "Cart cleared successfully"));
});
