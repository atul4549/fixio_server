import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
// import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";
import { ENV } from "./lib/env.js";
import { paymentRoutes } from "./routes/payment.route.js";

dotenv.config();

// const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(
  "/api/payment",
  (req, res, next) => {
    if (req.originalUrl === "/api/payment/webhook") {
      express.raw({ type: "application/json" })(req, res, next);
    } else {
      express.json()(req, res, next); // parse json for non-webhook routes
    }
  },
  paymentRoutes
);

// Compression middleware
// app.use(compression());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.use(cors({ origin: ENV.CLIENT_URL, credentials: true })); // credentials: true allows the browser to send the cookies to the server with the request

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Backend API is running",
    status: "healthy",
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
    docs: ENV.API_DOCS_URL || "No documentation URL set",
  });
});

app.use("/api/auth", authRoutes);
// app.use("/api/messages", messageRoutes);

if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
  });
}

const startServer = async () => {
  await connectDB()
    .then((result) => {
      server.listen(ENV.PORT, () => {
        console.log(`
          🚀 Server is running!
          ✅ Environment: ${ENV.NODE_ENV}
          ✅ Port: ${ENV.PORT}
          ✅ Health check: http://localhost:${ENV.PORT}/api/health
          ✅ Root endpoint: http://localhost:${ENV.PORT}/
          ✅ Time: ${new Date().toISOString()}
          `);
      });
    })
    .catch((err) => {
      console.error("Failed to start server:", err);
      process.exit(1);
    });
};

startServer();