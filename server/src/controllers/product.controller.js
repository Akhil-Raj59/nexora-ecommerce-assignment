import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

// Get all products
export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();

  if (products.length === 0) {
    // optional: seed mock data if DB empty
    const mockProducts = [
  {
    name: "T-Shirt",
    price: 499,
    image:
      "https://images.unsplash.com/photo-1585386959984-a41552231693?auto=format&fit=crop&w=400&q=80",
    description: "Soft cotton casual wear",
  },
  {
    name: "Jeans",
    price: 999,
    image:
      "https://images.unsplash.com/photo-1583001804900-5e6a06fdfd5d?auto=format&fit=crop&w=400&q=80",
    description: "Classic blue denim jeans",
  },
  {
    name: "Sneakers",
    price: 1999,
    image:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=400&q=80",
    description: "Lightweight comfortable running shoes",
  },
  {
    name: "Watch",
    price: 1499,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80",
    description: "Stylish analog wrist watch",
  },
  {
    name: "Headphones",
    price: 8099,
    image:
      "https://images.unsplash.com/photo-1583225272827-cc63b34e5f1d?auto=format&fit=crop&w=400&q=80",
    description: "Wireless Bluetooth headphones with rich sound",
  },
];

    await Product.insertMany(mockProducts);
    return res.status(200).json(new ApiResponse(200, mockProducts, "Mock products seeded successfully"));
  }

  return res.status(200).json(new ApiResponse(200, products, "Products fetched successfully"));
});
