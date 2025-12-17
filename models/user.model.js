import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone:{
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
    },
    username: {
      unique:true,
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    isVerified: {
      email: { type: Boolean, default: false },
      phone: { type: Boolean, default: false },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
      enum: ["customer", "servicer", "admin"],
      default: "customer",
    },
    totalServices: {
      type: Number,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
