import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

const sanitizeUser = (user) => {
  const sanitizedUser = user.toObject();
  delete sanitizedUser.password;
  return sanitizedUser;
};

export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

export const updateMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const allowedFields = ["name", "email", "phone", "address"];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  });

  const updatedUser = await user.save();

  res.status(200).json(sanitizeUser(updatedUser));
});
