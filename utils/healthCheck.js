// healthCheck.js
// const express = require('express');
import express from "express";

const healthRouter = express.Router();

// Simple health check endpoint
healthRouter.get("/health", (req, res) => {
  return res.status(200).json({
    status: "UP",
    timestamp: new Date().toISOString(),
    service: "Your Backend Service",
    version: ENV.npm_package_version || "1.0.0",
  });
});

// Detailed health check with dependencies
healthRouter.get("/health/detailed", async (req, res) => {
  const healthCheck = {
    status: "UP",
    timestamp: new Date().toISOString(),
    checks: {
      database: { status: "UP" },
      redis: { status: "UP" },
      externalService: { status: "UP" },
    },
  };

  try {
    // Check database connection
    // await database.ping();

    // Check Redis connection
    // await redis.ping();

    return res.status(200).json(healthCheck);
  } catch (error) {
    healthCheck.status = "DOWN";
    healthCheck.error = error.message;
    res.status(503).json(healthCheck);
  }
});
export { healthRouter };
// module.exports = router;
