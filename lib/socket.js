import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
// import { ENV } from "./env";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [ENV.CLIENT_URL],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));



  socket.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      console.log("Received message:", data); // Debugging line

      if (data.type === "locationUpdate" && data.role === "driver") {
        drivers[data.driver] = {
          latitude: data.data.latitude,
          longitude: data.data.longitude,
        };
        console.log("Updated driver location:", drivers[data.driver]); // Debugging line
      }

      if (data.type === "requestService" && data.role === "user") {
        console.log("Requesting service...");
        const nearbyDrivers = findNearbyDrivers(data.latitude, data.longitude);
        ws.send(
          JSON.stringify({ type: "nearbyServicers", drivers: nearbyDrivers })
        );
      }
    } catch (error) {
      console.log("Failed to parse WebSocket message:", error);
    }
  });



  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});


const findNearbyDrivers = (userLat, userLon) => {
  return Object.entries(drivers)
    .filter(([id, location]) => {
      const distance = geolib.getDistance(
        { latitude: userLat, longitude: userLon },
        location
      );
      return distance <= 5000; // 5 kilometers
    })
    .map(([id, location]) => ({ id, ...location }));
};


export { io, app, server };
