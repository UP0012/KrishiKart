import Enquiry from "../models/Enquiry.js";
import Product from "../models/Product.js";
import asyncHandler from "../utils/asyncHandler.js";

const populateEnquiry = [
  { path: "buyer", select: "name email phone address role" },
  { path: "farmer", select: "name email phone address role" },
  { path: "product", select: "name description price quantity category image farmer" }
];

export const createEnquiry = asyncHandler(async (req, res) => {
  const { productId, quantity, message } = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.farmer.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error("You cannot enquire about your own product");
  }

  const enquiry = await Enquiry.create({
    product: product._id,
    buyer: req.user._id,
    farmer: product.farmer,
    quantity,
    message
  });

  await enquiry.populate(populateEnquiry);

  res.status(201).json(enquiry);
});

export const getEnquiries = asyncHandler(async (req, res) => {
  let query = {};

  if (req.user.role === "buyer") {
    query = { buyer: req.user._id };
  }

  if (req.user.role === "farmer") {
    query = { farmer: req.user._id };
  }

  const enquiries = await Enquiry.find(query)
    .populate(populateEnquiry)
    .sort({ createdAt: -1 });

  res.status(200).json(enquiries);
});

export const updateEnquiryStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const enquiry = await Enquiry.findById(req.params.id);

  if (!enquiry) {
    res.status(404);
    throw new Error("Enquiry not found");
  }

  if (req.user.role !== "admin" && enquiry.farmer.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Forbidden: you can only update enquiries for your products");
  }

  enquiry.status = status;
  const updatedEnquiry = await enquiry.save();
  await updatedEnquiry.populate(populateEnquiry);

  res.status(200).json(updatedEnquiry);
});
