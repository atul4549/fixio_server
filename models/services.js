import mongoose from "mongoose";

const servicesSchema = new mongoose.Schema(
  {
    serviceName:{type: String},
    serviceIcon:{type: String},
    
  },
  { timestamps: true }
);

export const Service = mongoose.model("Services", servicesSchema);
