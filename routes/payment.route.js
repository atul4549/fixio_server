import { Router } from "express";
// import { protectRoute } from "../middleware/auth.middleware.js";
// import {
//   createPaymentIntent,
//   handleWebhook,
// } from "../controllers/payment.controller.js";

const paymentRoutes = Router();

// paymentRoutes.post("/create-intent", protectRoute, createPaymentIntent);

// No auth needed - Stripe validates via signature
// paymentRoutes.post("/webhook", handleWebhook);

export { paymentRoutes };
