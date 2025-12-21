import express from "express";
import {
  getAllRides,
  getAllServicer,
  getDriversById,
//   getLoggedInDriverData,
  newRide,
//   sendingOtpToPhone,
  updateDriverStatus,
  updatingRideStatus,
//   verifyingEmailOtp,
//   verifyPhoneOtpForLogin,
//   verifyPhoneOtpForRegistration,
} from "../controllers/service.controller.js";
import { isAuthenticatedDriver } from "../middleware/auth.middleware.js";
// import { registerAsService } from "../controllers/RegisterAsService.js";
// import upload from '../middleware/uploadMiddleware.js'; // Multer middleware for file upload
import { registerAsService } from "../controllers/registerAsService.js";

const serviceRoutes = express.Router();

// Configure multer for file upload (adjust as needed)
// const serviceUpload = upload.single('aadharUpload');

//  bad me karunga
// serviceRoutes.post("/register-as-service",serviceUpload, registerAsService);
serviceRoutes.post("/register-as-service", registerAsService);
serviceRoutes.get("/get-servicers-data", getAllServicer);
serviceRoutes.get("/get-services", getAllServicer);

// serviceRoutes.get("/get-servicers-data", getDriversById);

serviceRoutes.put("/update-status", isAuthenticatedDriver, updateDriverStatus);

serviceRoutes.post("/new-service", isAuthenticatedDriver, newRide);

serviceRoutes.put(
  "/update-service-status",
  isAuthenticatedDriver,
  updatingRideStatus
);

serviceRoutes.get("/get-services", isAuthenticatedDriver, getAllRides);

export { serviceRoutes };
