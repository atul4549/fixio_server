// import express from "express";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import cors from "cors";

// import path from "path";
// import { healthRouter } from "./utils/healthCheck.js";
// import { app, server } from "./utils/socket.js";

// // import { connectDB } from "./lib/db.js";

// // import authRoutes from "./routes/auth.route.js";
// // import messageRoutes from "./routes/message.route.js";
// // import { app, server } from "./lib/socket.js";

// dotenv.config();

// const PORT = process.env.PORT;
// const __dirname = path.resolve();

// app.use(express.json());
// app.use(cookieParser());
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );

// // app.use("/api/auth", authRoutes);
// // app.use("/api/messages", messageRoutes);
// app.use("/api", healthRouter);
// // app.use("/", return "hello");
// app.use("/", (req, res) => {
//   res.send("Hello World!");
// });

// // You can also add more routes
// app.get("/health", (req, res) => {
//   res.json({ status: "healthy", timestamp: new Date().toISOString() });
// });


// // const express = require('express');
// // const app = express();
// // const PORT = process.env.PORT || 3000;

// // Middleware
// app.use(express.json());

// // Root route
// app.get("/", (req, res) => {
//   res.send("Hello from Backend API!");
// });

// // Health check route
// app.get("/health", (req, res) => {
//   res.json({
//     status: "UP",
//     message: "Backend is running",
//     timestamp: new Date().toISOString()
//   });
// });

// // API routes
// app.get("/api/users", (req, res) => {
//   res.json([{ id: 1, name: "John" }, { id: 2, name: "Jane" }]);
// });

// // 404 handler for undefined routes
// app.use((req, res) => {
//   res.status(404).send("Route not found");
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// });

// // Start server
// server.listen(PORT, () => {
//   console.log(`✅ Server is running on port ${PORT}`);
//   console.log(`📡 Health check available at http://localhost:${PORT}/health`);
// });
// // if (process.env.NODE_ENV === "production") {

// //   app.use(express.static(path.join(__dirname, "../frontend/dist")));

// //   app.get("*", (req, res) => {
// //     res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
// //   });
// // }

// // server.listen(PORT, () => {
// //   console.log("server is running on PORT:" + PORT);
// // //   connectDB();
// // });


// app.js (main application file)
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
// import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

// Initialize environment variables
dotenv.config();

// ES modules fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes and utilities
import { healthRouter } from "./utils/healthCheck.js";
import { app, server } from "./utils/socket.js";

// Database connection (uncomment when ready)
// import { connectDB } from "./lib/db.js";

// Import routes (uncomment when ready)
// import authRoutes from "./routes/auth.route.js";
// import messageRoutes from "./routes/message.route.js";

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Security middleware
app.use(helmet({
  contentSecurityPolicy: NODE_ENV === "production" ? undefined : false,
  crossOriginEmbedderPolicy: false,
}));

// Compression middleware
app.use(compression());

// Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: NODE_ENV === "production" ? 100 : 1000, // limit each IP to 100 requests per windowMs in production
//   message: "Too many requests from this IP, please try again later.",
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// Apply rate limiting to API routes
// app.use("/api/", limiter);

// CORS configuration
const corsOptions = {
  origin: NODE_ENV === "production" 
    ? process.env.ALLOWED_ORIGINS?.split(",") || []
    : "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Request logging middleware (in production, use a proper logger like Winston)
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });
  next();
});

// API Routes (uncomment when ready)
// app.use("/api/auth", authRoutes);
// app.use("/api/messages", messageRoutes);

// Health check route
app.use("/api/health", healthRouter);

// Sample API routes
app.get("/api/users", (req, res) => {
  res.json([
    { id: 1, name: "John", email: "john@example.com" },
    { id: 2, name: "Jane", email: "jane@example.com" },
  ]);
});

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Backend API is running",
    status: "healthy",
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
    docs: process.env.API_DOCS_URL || "No documentation URL set",
  });
});

// Static files (if needed for admin panel or docs)
app.use("/public", express.static(path.join(__dirname, "public")));

// 404 handler for undefined routes
// app.use("*", (req, res) => {
//   res.status(404).json({
//     error: "Route not found",
//     path: req.originalUrl,
//     timestamp: new Date().toISOString(),
//   });
// });

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", {
    message: err.message,
    stack: NODE_ENV === "development" ? err.stack : undefined,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  const statusCode = err.statusCode || 500;
  const message = NODE_ENV === "production" && statusCode === 500 
    ? "Internal server error" 
    : err.message;

  res.status(statusCode).json({
    error: message,
    ...(NODE_ENV === "development" && { stack: err.stack }),
    timestamp: new Date().toISOString(),
  });
});

// Graceful shutdown
const gracefulShutdown = () => {
  console.log("Received shutdown signal, closing server gracefully...");
  
  server.close(() => {
    console.log("HTTP server closed");
    // Close database connections here if any
    // Example: if (mongoose.connection) mongoose.connection.close();
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.error("Could not close connections in time, forcefully shutting down");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

// Unhandled promise rejection handler
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

// Uncaught exception handler
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

// Start server
const startServer = async () => {
  try {
    // Initialize database connection (uncomment when ready)
    // await connectDB();
    
    server.listen(PORT, () => {
      console.log(`
🚀 Server is running!
✅ Environment: ${NODE_ENV}
✅ Port: ${PORT}
✅ Health check: http://localhost:${PORT}/api/health
✅ Root endpoint: http://localhost:${PORT}/
✅ Time: ${new Date().toISOString()}
      `);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;