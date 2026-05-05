import express from "express";
import { createOrder, getOrders } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("buyer", "admin"), createOrder);
router.get("/", protect, authorize("buyer", "farmer", "admin"), getOrders);

export default router;
