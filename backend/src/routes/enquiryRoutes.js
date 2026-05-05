import express from "express";
import {
  createEnquiry,
  getEnquiries,
  updateEnquiryStatus
} from "../controllers/enquiryController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, authorize("buyer", "admin"), createEnquiry)
  .get(protect, authorize("buyer", "farmer", "admin"), getEnquiries);

router.put("/:id/status", protect, authorize("farmer", "admin"), updateEnquiryStatus);

export default router;
