// // import mongoose from "mongoose";

// import mongoose, { Schema, Document } from 'mongoose';

// // export interface IService extends Document {
// //   email: string;
// //   phoneNumber: string;
// //   experience: number;
// //   category: string;
// //   skill: string;
// //   aadharUpload: string;
// //   registrationDate: Date;
// //   isVerified: boolean;
// //   status: 'pending' | 'approved' | 'rejected';
// //   rejectionReason?: string;
// //   verificationDate?: Date;
// //   createdAt: Date;
// //   updatedAt: Date;
// // }

// // const ServiceSchema: Schema = new Schema({
// const ServiceSchema = new Schema({
//   email: {
//     type: String,
//     // required: true,
//     unique: true,
//     trim: true,
//     lowercase: true,
//     match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
//   },
//   phoneNumber: {
//     type: String,
//     // required: true,
//     unique: true,
//     trim: true,
//     match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number']
//   },
//   experience: {
//     type: Number,
//     default: 0,
//     min: 0,
//     max: 50
//   },
//   category: {
//     type: String,
//     required: true,
//     enum: ['Service', 'Freelance', 'Other']
//   },
//   skill: {
//     type: String,
//     required: true
//   },
//   aadharUpload: {
//     type: String,
//     // required: true
//   },
//   registrationDate: {
//     type: Date,
//     default: Date.now
//   },
//   isVerified: {
//     type: Boolean,
//     default: false
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'approved', 'rejected'],
//     default: 'pending'
//   },
//   rejectionReason: {
//     type: String
//   },
//   verificationDate: {
//     type: Date
//   }
// }, {
//   timestamps: true
// });

// // Indexes for faster queries
// // ServiceSchema.index({ email: 1 });
// // ServiceSchema.index({ phoneNumber: 1 });
// // ServiceSchema.index({ status: 1 });
// // ServiceSchema.index({ skill: 1 });
// // ServiceSchema.index({ category: 1 });

// // export const ServiceModel = mongoose.model<IService>('Service', ServiceSchema);
// export const ServiceModel = mongoose.model('Service', ServiceSchema);

// // export default ServiceModel;

// const userSchema = new mongoose.Schema(
//   {
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },
//     phone:{
//       type: String,
//       // required: true,
//       unique: true,
//       trim: true,
//     },
//     name: {
//       type: String,
//       // required: true,
//     },
//     username: {
//       unique:true,
//       type: String,
//       required: true,
//     },
//     password: {
//       type: String,
//       required: true,
//       minlength: 6,
//     },
//     profilePic: {
//       type: String,
//       default: "",
//     },
//     isVerified: {
//       email: { type: Boolean, default: false },
//       phone: { type: Boolean, default: false },
//     },
//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//     createdAt: {
//       type: Date,
//       default: Date.now,
//     },
//     role: {
//       type: String,
//       enum: ["customer", "servicer", "admin"],
//       default: "customer",
//     },
//     totalServices: {
//       type: Number,
//     },Service:{
//       type: ServiceModel
//     }
//   },
//   { timestamps: true }
// );

// export const User = mongoose.model("User", userSchema);

// // export default User;


import mongoose, { Schema, Document, Model } from 'mongoose';

// Service Interface
// export interface IService extends Document {
//   email: string;
//   phoneNumber: string;
//   experience: number;
//   category: string;
//   skill: string;
//   aadharUpload: string;
//   registrationDate: Date;
//   isVerified: boolean;
//   status: 'pending' | 'approved' | 'rejected';
//   rejectionReason?: string;
//   verificationDate?: Date;
//   createdAt: Date;
//   updatedAt: Date;
// }
// import { mongoose } from "mongoose";
// Booking Schema
const bookingSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    sendTo: {
        type: String,
        required: true
    },
    userName: String,
    userEmail: String,
    currentLocation: {
      latitude: Number,
      longitude: Number
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  
export  const Booking = mongoose.model('Booking', bookingSchema);
// Service Schema
const ServiceSchema = new Schema({
  email: {
    type: String,
    required: false,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
  },
  phoneNumber: {
    type: String,
    required: false,
    unique: true,
    trim: true,
    match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number']
  },
  experience: {
    type: Number,
    default: 0,
    min: 0,
    max: 50
  },
  category: {
    type: String,
    required: true,
    enum: ['Service', 'Freelance', 'Other']
  },
  skill: {
    type: String,
    required: true
  },
  aadharUpload: {
    type: String,
    required: false
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: {
    type: String
  },
  verificationDate: {
    type: Date
  }, bookings:{
    type: Schema.Types.ObjectId,
    ref: 'Bookings' // Reference to Service collection
  
  }
}, {
  timestamps: true
});

// Indexes for faster queries
// ServiceSchema.index({ email: 1 });
// ServiceSchema.index({ phoneNumber: 1 });
// ServiceSchema.index({ status: 1 });
// ServiceSchema.index({ skill: 1 });
// ServiceSchema.index({ category: 1 });

// Service Model
export const ServiceModel = mongoose.model('Service', ServiceSchema);


// User Schema
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: false,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: false,
  },
  username: {
    type: String,
    unique: true,
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
  role: {
    type: String,
    enum: ["customer", "servicer", "admin"],
    default: "customer",
  },
  totalServices: {
    type: Number,
    default: 0
  },
  Service: {
    type: Schema.Types.ObjectId,
    ref: 'Service' // Reference to Service collection
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for User schema
// userSchema.index({ email: 1 });
// userSchema.index({ phone: 1 });
// userSchema.index({ username: 1 });
// userSchema.index({ role: 1 });

// Virtual for populating service details
// userSchema.virtual('serviceDetails', {
//   ref: 'Service',
//   localField: 'Service',
//   foreignField: '_id',
//   justOne: true
// });

// User Model
export const User = mongoose.model('User', userSchema);

// Export both models
export default { User, ServiceModel };