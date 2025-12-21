import dotenv from "dotenv";
dotenv.config();
// import express from "express";
import twilio from "twilio";
import jwt from "jsonwebtoken";
import { MongoClient, ObjectId } from "mongodb";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { ServiceModel } from "../models/user.model.js";

// Initialize MongoDB client
// const mongoClient = new MongoClient(process.env.MONGODB_URI);
// let db;

// Connect to MongoDB
// async function connectDB() {
//   try {
//     await mongoClient.connect();
//     db = mongoClient.db(process.env.MONGODB_DB_NAME);
//     console.log("Connected to MongoDB");
//   } catch (error) {
//     console.error("MongoDB connection error:", error);
//   }
// }

// connectDB();

// Initialize Clerk
// const clerk = clerkClient(process.env.CLERK_SECRET_KEY);

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = twilio(accountSid, authToken, {
//   lazyLoading: true,
// });

// Get logged in driver data
export const getLoggedInDriverData = async (req, res) => {
  try {
    const driver = req.driver;

    res.status(201).json({
      success: true,
      driver,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Updating driver status
export const updateDriverStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const driver = await db
      .collection("drivers")
      .findOneAndUpdate(
        { _id: new ObjectId(req.driver._id) },
        { $set: { status } },
        { returnDocument: "after" }
      );

    if (!driver.value) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    res.status(201).json({
      success: true,
      driver: driver.value,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get drivers data with id
export const getDriversById = async (req, res) => {
  try {
    const { ids } = req.query;
    console.log(ids, "ids");

    if (!ids) {
      return res.status(400).json({ message: "No driver IDs provided" });
    }

    const driverIds = ids.split(",").map((id) => new ObjectId(id));

    // Fetch drivers from database
    const drivers = await db
      .collection("drivers")
      .find({
        _id: { $in: driverIds },
      })
      .toArray();

    res.json(drivers);
  } catch (error) {
    console.error("Error fetching driver data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Creating new ride
export const newRide = async (req, res) => {
  try {
    const {
      userId,
      charge,
      status,
      currentLocationName,
      destinationLocationName,
      distance,
    } = req.body;

    // Get Clerk user data if needed
    const clerkUser = userId.startsWith("user_")
      ? await clerk.users.getUser(userId)
      : null;

    const newRide = {
      userId,
      driverId: req.driver._id,
      charge: parseFloat(charge),
      status,
      currentLocationName,
      destinationLocationName,
      distance,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("rides").insertOne(newRide);

    const createdRide = {
      _id: result.insertedId,
      ...newRide,
    };

    res.status(201).json({ success: true, newRide: createdRide });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Updating ride status
export const updatingRideStatus = async (req, res) => {
  try {
    const { rideId, rideStatus } = req.body;

    // Validate input
    if (!rideId || !rideStatus) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid input data" });
    }

    const driverId = req.driver?._id;
    if (!driverId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Fetch the ride data to get the rideCharge
    const ride = await db.collection("rides").findOne({
      _id: new ObjectId(rideId),
    });

    if (!ride) {
      return res
        .status(404)
        .json({ success: false, message: "Ride not found" });
    }

    const rideCharge = ride.charge;

    // Update ride status
    const updatedRide = await db.collection("rides").findOneAndUpdate(
      {
        _id: new ObjectId(rideId),
        driverId: driverId,
      },
      {
        $set: {
          status: rideStatus,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    if (rideStatus === "Completed") {
      // Update driver stats if the ride is completed
      await db.collection("drivers").findOneAndUpdate(
        { _id: driverId },
        {
          $inc: {
            totalEarning: rideCharge,
            totalRides: 1,
          },
        }
      );
    }

    res.status(201).json({
      success: true,
      updatedRide: updatedRide.value,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Getting drivers rides
export const getAllRides = async (req, res) => {
  try {
    const rides = await ServiceModel.collection("services");
    // .aggregate([
    //   {
    //     $match: {
    //       servicerId: req.servicer?._id,
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "drivers",
    //       localField: "driverId",
    //       foreignField: "_id",
    //       as: "driver",
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "userId",
    //       foreignField: "_id",
    //       as: "user",
    //     },
    //   },
    //   {
    //     $unwind: {
    //       path: "$driver",
    //       preserveNullAndEmptyArrays: true,
    //     },
    //   },
    //   {
    //     $unwind: {
    //       path: "$user",
    //       preserveNullAndEmptyArrays: true,
    //     },
    //   },
    // ]).toArray();
    // console.log(rides)
    return res.status(201).json({
      rides,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// export const getAllServicer = async (req,res) =>{
//   try {
//     const servicer = await ServiceModel.find({}).toArray();

//     return res.status(201).json({
//       success: true,
//       message: "Servicer fetched successfully",
//       data: servicer,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// }

// import { Request, Response } from 'express';
// import ServiceModel from '../models/Service';
// TODO: //===================================================================== V1
export const getAllServicer = async (req, res) => {
  try {
    // Use find() instead of find({}).toArray()
    // const {sendTo}  = req.body
    const servicers = await ServiceModel.find();

    // If you want to exclude certain fields (like sensitive data)
    const servicersData = servicers.map(servicer => ({
      _id: servicer._id,
      id: servicer._id.toString(),
      email: servicer.email,
      phoneNumber: servicer.phoneNumber,
      experience: servicer.experience,
      category: servicer.category,
      skill: servicer.skill,
      status: servicer.status,
      registrationDate: servicer.registrationDate,
      isVerified: servicer.isVerified,
      // Add other fields as needed
    }));
// console.log(servicersData)
    return res.status(200).json({
      success: true,
      message: "Servicers fetched successfully",
      count: servicers.length,
      data: servicersData,
    });
  } catch (error) {
    console.error('Error fetching servicers:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch servicers',
    });
  }
};

// ===================================================================== TODO:  V2
// Backend - servicers.js (or servicerController.js)
// export const getAllServicer = async (req, res) => {
//   try {
//     const { sendTo } = req.body;

//     // Validate that sendTo is provided
//     if (!sendTo) {
//       return res.status(400).json({
//         success: false,
//         message: "sendTo parameter is required",
//       });
//     }

//     const servicers = await ServiceModel.find({ sendTo });

//     // If you want to exclude certain fields (like sensitive data)
//     const servicersData = servicers.map(servicer => ({
//       _id: servicer._id,
//       id: servicer._id.toString(),
//       email: servicer.email,
//       phoneNumber: servicer.phoneNumber,
//       experience: servicer.experience,
//       category: servicer.category,
//       skill: servicer.skill,
//       status: servicer.status,
//       registrationDate: servicer.registrationDate,
//       isVerified: servicer.isVerified,
//       // Add other fields as needed
//     }));

//     return res.status(200).json({
//       success: true,
//       message: "Servicers fetched successfully",
//       count: servicers.length,
//       data: servicersData,
//     });
//   } catch (error) {
//     console.error('Error fetching servicers:', error);
//     return res.status(500).json({
//       success: false,
//       message: error.message || 'Failed to fetch servicers',
//     });
//   }
// };
//===================================================================== TODO:  V3

// // Backend - notificationController.js
// export const getAllNotifications = async (req, res) => {
//   try {
//     // If you want to filter by sendTo in backend, use query params instead of body for GET
//     const { sendTo } = req.query; // Changed from req.body to req.query

//     // let query = {};
//     // if (sendTo) {
//     //   query.sendTo = sendTo;
//     // }
//     // console.log(sendTo)
//     // Assuming you have a NotificationModel
//     // const notifications = await NotificationModel.find(query)
//     const notifications = await ServiceModel.find({sendTo})
//       // .sort({ createdAt: -1 }) // Most recent first
//       // .limit(100); // Limit results
// console.log(notifications)
//     // const notificationsData = notifications.map((notification) => ({
//     //   _id: notification._id,
//     //   id: notification._id.toString(),
//     //   title: notification.title,
//     //   message: notification.message,
//     //   type: notification.type,
//     //   sendTo: notification.sendTo,
//     //   read: notification.read || false,
//     //   createdAt: notification.createdAt,
//     //   status: notification.status,
//     //   // Add other fields from your notification schema
//     // }));

//     return res.status(200).json({
//       success: true,
//       message: "Notifications fetched successfully",
//       count: notifications.length,
//       data: notifications,
//       // data: notificationsData,
//     });
//   } catch (error) {
//     console.error("Error fetching notifications:", error);
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Failed to fetch notifications",
//     });
//   }
// };
// export { getAllNotifications as getAllServicer };
// Backend - notificationController.js
// export const getAllNotifications = async (req, res) => {
//   try {
//     // For GET requests, always use query parameters, not body
//     // const { sendTo, read, type, limit = 50, page = 1 } = req.query;
//     const { sendTo } = req.query;
//     console.log("send to", sendTo)
//     // Build query object
//     let query = {};
    
//     if (sendTo) {
//       query.sendTo = sendTo;
//     }
    
//     // Optional filters
//     // if (read !== undefined) {
//     //   query.read = read === 'true'; // Convert string to boolean
//     // }
    
//     // if (type) {
//     //   query.type = type;
//     // }
    
//     console.log('Notification query:', query);
    
//     // Calculate pagination
//     // const skip = (parseInt(page) - 1) * parseInt(limit);
//     // const parsedLimit = parseInt(limit);
    
//     // Fetch notifications with pagination and sorting
//     const notifications = await ServiceModel.find(query)
//       .sort({ createdAt: -1 }) // Most recent first
//       // .skip(skip)
//       // .limit(parsedLimit > 100 ? 100 : parsedLimit); // Cap at 100 for safety
    
//     // Get total count for pagination info
//     const totalCount = await ServiceModel.countDocuments(query);
    
//     // Transform data if needed (cleaner mapping)
//     const notificationsData = notifications.map(notification => ({
//       id: notification._id.toString(),
//       _id: notification._id,
//       title: notification.title,
//       message: notification.message,
//       type: notification.type,
//       sendTo: notification.sendTo,
//       read: notification.read || false,
//       createdAt: notification.createdAt,
//       updatedAt: notification.updatedAt,
//       status: notification.status,
//       // Include any other relevant fields
//     }));
    
//     return res.status(200).json({
//       success: true,
//       message: "Notifications fetched successfully",
//       count: notificationsData.length,
//       total: totalCount,
//       page: parseInt(page),
//       totalPages: Math.ceil(totalCount / parsedLimit),
//       data: notificationsData,
//     });
    
//   } catch (error) {
//     console.error("Error fetching notifications:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined,
//     });
//   }
// };
















//======================================================================= other version

// Backend - notificationController.js
// export const getAllNotifications = async (req, res) => {
//   try {
//     const { sendTo } = req.query;

//     let query = {};
    
//     if (sendTo) {
//       query.sendTo = sendTo;
//     }
    
//     // console.log('Notification query:', query);
    
//     // Use NotificationModel instead of ServiceModel
//     // const notifications = await ServiceModel.find(query)
//     const notifications = await ServiceModel.find()
//       // .sort({ createdAt: -1 }) // Most recent first
//     // console.log( 'notification',notifications)
//     // console.log( 'notification email',notifications[0].email)
//     // Get total count for pagination info
//     const totalCount = await ServiceModel.countDocuments(query);
    
    
//         // Transform data - include userId field from your document
//         // const notificationsData = notifications.map(notification => ({
//         //   id: notification._id.toString(),
//         //   userId: notification.userId, // Add this field
//         //   sendTo: notification.sendTo,
//         //   status: notification.status, // Add this field
//         //   createdAt: notification.createdAt,
//         //   updatedAt: notification.updatedAt,
//         //   // Include other fields from your document if needed
//         //   _id: notification._id,
//         //   __v: notification.__v
//         // }));
//         // console.log(notificationsData)
        
//     if(query.sendTo ===  notifications[0].email) {
//       console.log('filtered data')

//       return res.status(200).json(notifications)
//       // return res.status(200).json({
//       //   success: true,
//       //   message: "Notifications fetched successfully",
//       //   count: notifications.length,
//       //   total: totalCount,
//       //   data: notifications,
//       // });

//     }else{ console.log('not match')
//       const obj = null;
//       const copy = {...(obj || {})}; // Provide fallback
//       return res.status(200).json({
//         success: true,
//         count: notifications.length,
//         total: totalCount,
//         data: copy

//       })

//     }
//   } catch (error) {
//     console.error("Error fetching notifications:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined,
//     });
//   }
// };


export const getAllNotifications = async (req, res) => {
  try {
    const { sendTo } = req.query;

    // Build query based on sendTo parameter
    let query = {};
    if (sendTo) {
      query.sendTo = sendTo;
    }

    // Fetch notifications based on query
    const notifications = await ServiceModel.find(query);
    const totalCount = await ServiceModel.countDocuments(query);

    // If no notifications found
    if (notifications.length === 0) {
      return res.status(200).json({
        success: true,
        message: sendTo ? `No notifications found for ${sendTo}` : "No notifications found",
        count: 0,
        total: totalCount,
        data: []
      });
    }

    // Check if sendTo matches the email in notifications
    // Note: This logic seems redundant since we already filtered by query
    // If you want to verify that the first notification matches the query
    if (sendTo && notifications[0].email === sendTo) {
      console.log('Filtered data matches email query');
      return res.status(200).json({
        success: true,
        message: "Notifications fetched successfully",
        count: notifications.length,
        total: totalCount,
        data: notifications,
      });
    }

    // If sendTo doesn't match (this case seems unlikely with proper query)
    console.log('No matching notifications found');
    return res.status(200).json({
      success: true,
      message: "No matching notifications found",
      count: 0,
      total: totalCount,
      data: []
    });

  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};