// import dotenv from "dotenv";
// dotenv.config();

// import express from "express";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import userRouter from "./routes/user.route";
// import Nylas from "nylas";
// import driverRouter from "./routes/driver.route";

// export const app = express();
// app.use(cors({ origin: ENV.CLIENT_URL, credentials: true })); // credentials: true allows the browser to send the cookies to the server with the request

// export const nylas = new Nylas({
//   apiKey: process.env.NYLAS_API_KEY!,
//   apiUri: "https://api.eu.nylas.com",
// });

// body parser
// app.use(express.json({ limit: "50mb" }));

// cookie parserv
// app.use(cookieParser());
// import authRoutes from "./routes/auth.route.js";
// import { serviceRoutes } from "./routes/service.route.js";
// import { ENV } from "./lib/env.js";
// import { Booking } from "./models/bookingSchema.js";
// routes

// // app.use("/api/v1", userRouter);
// app.use("/api/auth", authRoutes);
// // app.use("/api/v1/driver", driverRouter);
// app.use("/api/service", serviceRoutes);







// // API Routes
// app.post('/api/bookings', async (req, res) => {
//   try {
//     const { user, currentLocation } = req.body;
    
//     // Validate request
//     if (!user || !currentLocation) {
//       return res.status(400).json({
//         success: false,
//         message: 'User and location data are required'
//       });
//     }
    
//     // Create booking in database
//     const booking = new Booking({
//       userId: user.id || user._id,
//       userName: user.name,
//       userEmail: user.email,
//       currentLocation: {
//         latitude: currentLocation.latitude,
//         longitude: currentLocation.longitude
//       },
//       status: 'pending'
//     });
    
//     await booking.save();
    
//     // Create notification data
//     const notificationData = {
//       type: 'NEW_BOOKING',
//       title: 'New Booking Request',
//       message: `${user.name} has requested a booking`,
//       bookingId: booking._id,
//       userId: user.id || user._id,
//       userName: user.name,
//       location: currentLocation,
//       timestamp: new Date().toISOString()
//     };
    
//     // Send real-time notification to all connected admin users
//     io.emit('admin-notification', notificationData);
    
//     // Send confirmation to the specific user who made the booking
//     const userSocketId = connectedUsers.get(user.id || user._id);
//     if (userSocketId) {
//       io.to(userSocketId).emit('booking-confirmation', {
//         type: 'BOOKING_CONFIRMED',
//         title: 'Booking Confirmed',
//         message: 'Your booking has been received and is being processed',
//         bookingId: booking._id,
//         status: 'pending',
//         timestamp: new Date().toISOString()
//       });
//     }
    
//     // Also send via HTTP response
//     res.status(201).json({
//       success: true,
//       message: 'Booking created successfully',
//       data: {
//         booking,
//         notification: notificationData
//       }
//     });
    
//   } catch (error) {
//     console.error('Error creating booking:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error creating booking',
//       error: error.message
//     });
//   }
// });

// // Get all bookings (for admin)
// app.get('/api/bookings', async (req, res) => {
//   try {
//     const bookings = await Booking.find().sort({ createdAt: -1 });
//     res.json({
//       success: true,
//       data: bookings
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching bookings'
//     });
//   }
// });

// // Update booking status
// app.put('/api/bookings/:id/status', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;
    
//     const booking = await Booking.findByIdAndUpdate(
//       id,
//       { status },
//       { new: true }
//     );
    
//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message: 'Booking not found'
//       });
//     }
    
//     // Notify user about status change
//     const userSocketId = connectedUsers.get(booking.userId);
//     if (userSocketId) {
//       io.to(userSocketId).emit('booking-status-update', {
//         type: 'STATUS_UPDATE',
//         title: 'Booking Status Updated',
//         message: `Your booking status is now: ${status}`,
//         bookingId: booking._id,
//         status: status,
//         timestamp: new Date().toISOString()
//       });
//     }
    
//     res.json({
//       success: true,
//       data: booking
//     });
    
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error updating booking'
//     });
//   }
// });









// // testing api
// app.get("/test", (req, res,next ) => {
//   res.status(200).json({
//     succcess: true,
//     message: "API is working",
//   });
// });
