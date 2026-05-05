import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";

const canManageProduct = (user, product) => {
  return user.role === "admin" || product.farmer.toString() === user._id.toString();
};

export const getProducts = asyncHandler(async (req, res) => {
  const { category, search, farmer } = req.query;
  const query = {};

  if (category) {
    query.category = category;
  }

  if (farmer) {
    query.farmer = farmer;
  }

  if (search) {
    query.$text = { $search: search };
  }

  const products = await Product.find(query)
    .populate("farmer", "name email phone address role")
    .sort({ createdAt: -1 });

  res.status(200).json(products);
});

export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, quantity, category, image } = req.body;

  const product = await Product.create({
    name,
    description,
    price,
    quantity,
    category,
    image,
    farmer: req.user._id
  });

  const populatedProduct = await product.populate("farmer", "name email phone address role");

  res.status(201).json(populatedProduct);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (!canManageProduct(req.user, product)) {
    res.status(403);
    throw new Error("Forbidden: you can only manage your own products");
  }

  const allowedFields = ["name", "description", "price", "quantity", "category", "image"];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      product[field] = req.body[field];
    }
  });

  const updatedProduct = await product.save();
  await updatedProduct.populate("farmer", "name email phone address role");

  res.status(200).json(updatedProduct);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (!canManageProduct(req.user, product)) {
    res.status(403);
    throw new Error("Forbidden: you can only manage your own products");
  }

  await product.deleteOne();

  res.status(200).json({ message: "Product deleted successfully" });
});
