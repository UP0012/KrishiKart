import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createOrder = asyncHandler(async (req, res) => {
  const { products, totalAmount, status } = req.body;

  if (!Array.isArray(products) || products.length === 0) {
    res.status(400);
    throw new Error("Products are required");
  }

  const session = await mongoose.startSession();
  let order;

  try {
    await session.withTransaction(async () => {
      for (const item of products) {
        const product = await Product.findById(item.productId).session(session);

        if (!product) {
          res.status(404);
          throw new Error(`Product not found: ${item.productId}`);
        }

        if (product.quantity < item.quantity) {
          res.status(400);
          throw new Error(`Insufficient quantity for ${product.name}`);
        }

        product.quantity -= item.quantity;
        await product.save({ session });
      }

      const createdOrders = await Order.create(
        [
          {
            products,
            totalAmount,
            buyer: req.user._id,
            status
          }
        ],
        { session }
      );

      order = createdOrders[0];
    });
  } finally {
    await session.endSession();
  }
  await order.populate([
    { path: "buyer", select: "name email phone address role" },
    { path: "products.productId", select: "name description price quantity category image farmer" }
  ]);

  res.status(201).json(order);
});

export const getOrders = asyncHandler(async (req, res) => {
  let query = {};

  if (req.user.role === "buyer") {
    query = { buyer: req.user._id };
  }

  let orders = await Order.find(query)
    .populate("buyer", "name email phone address role")
    .populate("products.productId", "name description price quantity category image farmer")
    .sort({ createdAt: -1 });

  if (req.user.role === "farmer") {
    orders = orders.filter((order) =>
      order.products.some((item) => {
        const product = item.productId;
        return product?.farmer?.toString() === req.user._id.toString();
      })
    );
  }

  res.status(200).json(orders);
});
