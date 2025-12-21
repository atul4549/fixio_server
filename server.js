import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// import path from "path";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
// // import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";
import { ENV } from "./lib/env.js";
// import { paymentRoutes } from "./routes/payment.route.js";
import { serviceRoutes } from "./routes/service.route.js";
// import { adminRoutes } from "./routes/admin.route.js";

dotenv.config();

// const PORT =PORT;
// // const __dirname = path.resolve();

// app.use(
//   "/api/payment",
//   (req, res, next) => {
//     if (req.originalUrl === "/api/payment/webhook") {
//       express.raw({ type: "application/json" })(req, res, next);
//     } else {
//       express.json()(req, res, next); // parse json for non-webhook routes
//     }
//   },
//   paymentRoutes
// );

// // Compression middleware
// // app.use(compression());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.use(cors({ origin: ENV.CLIENT_URL, credentials: true })); // credentials: true allows the browser to send the cookies to the server with the request
// // console.log(ENV.CLIENT_URL)
// // Root route
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
app.use("/api/service", serviceRoutes);
app.use("/api/notifications", notificationsRoute);
// app.use("/api/admin", adminRoutes);
// // app.use("/api/messages", messageRoutes);

// // if (ENV.NODE_ENV === "production") {
// //   app.use(express.static(path.join(__dirname, "../client/dist")));

// //   app.get("/{*any}", (req, res) => {
// //     res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
// //   });
// // }
// const activeRequests = new Map();
// // API endpoint to get all requests (optional)
// app.post('/api/requests', (req, res) => {
//   const requests = Array.from(activeRequests.values());
//   res.json({ requests });
// });

// // API endpoint to manually accept a request (optional)
// app.post('/api/requests/:requestId/accept', (req, res) => {
//   const { requestId } = req.params;
//   const { acceptedBy } = req.body;

//   const request = activeRequests.get(requestId);
//   if (!request) {
//     return res.status(404).json({ error: 'Request not found' });
//   }

//   request.status = 'accepted';
//   request.acceptedBy = acceptedBy;
  
//   // Notify the user who sent the request
//   io.to(request.userId).emit('request-updated', {
//     requestId,
//     status: 'accepted',
//     acceptedBy,
//     message: 'Your request has been accepted!'
//   });

//   res.json({ success: true, request });
// });


// // app.use("/api/v1", userRouter);
// app.use("/api/auth", authRoutes);
// // app.use("/api/v1/driver", driverRouter);
// app.use("/api/service", serviceRoutes);




import {Booking} from './models/user.model.js'
import {io} from './lib/socket.js'
import { notificationsRoute } from "./routes/notificationRoutes.js";

const connectedUsers = new Map();

// API Routes
app.post('/api/bookings', async (req, res) => {
  try {
    const { user, currentLocation , sendTo} = req.body;
    // console.log(req.body)
    // Validate request
    if (!user || !currentLocation || !sendTo) {
      return res.status(400).json({
        success: false,
        message: 'User and location data are required'
      });
    }
    
    // Create booking in database
    const booking = new Booking({
      userId: user.id || user._id,
      sendTo: sendTo,
      userName: user.name,
      userEmail: user.email,
      currentLocation: {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude
      },
      status: 'pending'
    });
    
    await booking.save();
    
    // Create notification data
    const notificationData = {
      type: 'NEW_BOOKING',
      title: 'New Booking Request',
      message: `${user.name} has requested a booking`,
      bookingId: booking._id,
      userId: user.id || user._id,
      userName: user.name,
      location: currentLocation,
      timestamp: new Date().toISOString()
    };
    
    // Send real-time notification to all connected admin users
    io.emit('admin-notification', notificationData);
    
    // Send confirmation to the specific user who made the booking
    const userSocketId = connectedUsers.get(user.id || user._id);
    if (userSocketId) {
      io.to(userSocketId).emit('booking-confirmation', {
        type: 'BOOKING_CONFIRMED',
        title: 'Booking Confirmed',
        message: 'Your booking has been received and is being processed',
        bookingId: booking._id,
        status: 'pending',
        timestamp: new Date().toISOString()
      });
    }
    
    // Also send via HTTP response
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        booking,
        notification: notificationData
      }
    });
    
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
});

// Get all bookings (for admin)
app.get('/api/bookings', async (req, res) => {
  try {
    
    const bookings = await Booking.find().sort({ createdAt: -1 });
    return res.json(bookings);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings'
    });
  }
});

// Update booking status
app.put('/api/bookings/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Notify user about status change
    const userSocketId = connectedUsers.get(booking.userId);
    if (userSocketId) {
      io.to(userSocketId).emit('booking-status-update', {
        type: 'STATUS_UPDATE',
        title: 'Booking Status Updated',
        message: `Your booking status is now: ${status}`,
        bookingId: booking._id,
        status: status,
        timestamp: new Date().toISOString()
      });
    }
    
    res.json({
      success: true,
      data: booking
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating booking'
    });
  }
});









// testing api
app.get("/test", (req, res,next ) => {
  res.status(200).json({
    succcess: true,
    message: "API is working",
  });
});





// import http from "http";
// import { app } from "./app.js";
// // import { app } from "./app";
// const server = http.createServer(app);


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



// create server
// server.listen(process.env.PORT, () => {
//   console.log(`Server is connected with port ${process.env.PORT}`);
// });
