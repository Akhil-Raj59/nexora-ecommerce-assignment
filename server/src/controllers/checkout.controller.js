import { Cart } from "../models/cart.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

// POST /api/checkout
export const checkout = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  const cart = await Cart.findOne().populate("items.product");

  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, "Cart is empty");
  }

  const total = cart.totalAmount;
  const receipt = {
    customer: { name, email },
    total,
    timestamp: new Date().toISOString()
  };

  // clear cart after checkout (optional)
  await Cart.deleteMany();

  return res.status(200).json(new ApiResponse(200, receipt, "Checkout successful"));
});
