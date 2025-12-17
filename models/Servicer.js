import mongoose from "mongoose";

const servicerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    service_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    rate: { type: String },
    totalEarning: { type: Number },
    totalServices: { type: Number },
    pendingServices: { type: Number },
    cancelServices: { type: Number },
    status: { type: String, default: "inactive" },
    cratedAt: {
      type: Date.now(),
    },
    updatedAt: {
      type: Date.now(),
    },
  },
  { timestamps: true }
);

export const Servicer = mongoose.model("Servicer", servicerSchema);
