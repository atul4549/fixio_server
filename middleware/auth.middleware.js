// import { requireAuth } from "@clerk/express";

// Middleware to authenticate driver (example)
export const isAuthenticatedDriver = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find driver in MongoDB
    const driver = await db.collection("drivers").findOne({
      _id: new ObjectId(decoded.driverId),
    });

    if (!driver) {
      return res.status(401).json({ message: "Driver not found" });
    }

    req.driver = driver;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};

// Example middleware to verify Clerk session
// export const verifyClerkSession = async (req, res, next) => {
//   try {
//     const sessionId = req.headers["session-id"];
//     const userId = req.headers["user-id"];

//     if (!sessionId || !userId) {
//       return res.status(401).json({ message: "Missing session or user ID" });
//     }

//     // Verify session with Clerk
//     const sessions = await clerk.users.getUserSessionsList(userId);
//     const validSession = sessions.data.find(session => session.id === sessionId);

//     if (!validSession) {
//       return res.status(401).json({ message: "Invalid session" });
//     }

//     req.userId = userId;
//     next();
//   } catch (error) {
//     console.error("Clerk session verification error:", error);
//     res.status(401).json({ message: "Authentication failed" });
//   }
// };























import { User } from "../models/user.model.js";
// import { ENV } from "../config/env.js";

// export const protectRoute = [
//   requireAuth(),
//   async (req, res, next) => {
//     try {
//       const clerkId = req.auth().userId;
//       if (!clerkId) return res.status(401).json({ message: "Unauthorized - invalid token" });

//       const user = await User.findOne({ clerkId });
//       if (!user) return res.status(404).json({ message: "User not found" });

//       req.user = user;

//       next();
//     } catch (error) {
//       console.error("Error in protectRoute middleware", error);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   },
// ];

// export const adminOnly = (req, res, next) => {
//   if (!req.user) {
//     return res.status(401).json({ message: "Unauthorized - user not found" });
//   }

//   if (req.user.email !== ENV.ADMIN_EMAIL) {
//     return res.status(403).json({ message: "Forbidden - admin access only" });
//   }

//   next();
// };
