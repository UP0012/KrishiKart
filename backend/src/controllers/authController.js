import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";

const userResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  address: user.address,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, address } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role,
    phone,
    address
  });

  res.status(201).json({
    token: generateToken(user),
    user: userResponse(user)
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.status(200).json({
    token: generateToken(user),
    user: userResponse(user)
  });
});
