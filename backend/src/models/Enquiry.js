import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"]
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"]
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: [500, "Message cannot exceed 500 characters"]
    },
    status: {
      type: String,
      enum: ["new", "contacted", "accepted", "rejected"],
      default: "new"
    }
  },
  { timestamps: true }
);

enquirySchema.index({ farmer: 1, createdAt: -1 });
enquirySchema.index({ buyer: 1, createdAt: -1 });
enquirySchema.index({ product: 1 });

const Enquiry = mongoose.model("Enquiry", enquirySchema);

export default Enquiry;
