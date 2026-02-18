//models/cart.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      quantity: Number,
      price: Number,
    }
  ],
  total: { type: Number, required: true },
  paymentMethod: { type: String, enum: ["card", "upi", "netbanking", "cod"], required: true },
  paymentStatus: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Order", orderSchema);
