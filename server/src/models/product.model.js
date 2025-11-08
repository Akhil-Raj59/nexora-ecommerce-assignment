import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    default: "https://via.placeholder.com/150"
  },
  description: {
    type: String,
    default: "No description available"
  },
  inStock: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export const Product = mongoose.model("Product", productSchema);
