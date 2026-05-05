import express from "express";
import {
  deleteAdminProduct,
  deleteUser,
  getAdminProducts,
  getUsers,
  updateUser
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/users", getUsers);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.get("/products", getAdminProducts);
router.delete("/products/:id", deleteAdminProduct);

export default router;
