// const express = require("express");
// const { WebSocketServer } = require("ws");
// const geolib = require("geolib");

// const app = express();
// const PORT = 3000;

// // Store driver locations
// let drivers = {};

// // Create WebSocket server
// const wss = new WebSocketServer({ port: 8080 });

// wss.on("connection", (ws) => {
//   ws.on("message", (message) => {
//     try {
//       const data = JSON.parse(message);
//       console.log("Received message:", data); // Debugging line

//       if (data.type === "locationUpdate" && data.role === "driver") {
//         drivers[data.driver] = {
//           latitude: data.data.latitude,
//           longitude: data.data.longitude,
//         };
//         console.log("Updated driver location:", drivers[data.driver]); // Debugging line
//       }

//       if (data.type === "requestService" && data.role === "user") {
//         console.log("Requesting service...");
//         const nearbyDrivers = findNearbyDrivers(data.latitude, data.longitude);
//         ws.send(
//           JSON.stringify({ type: "nearbyServicers", drivers: nearbyDrivers })
//         );
//       }
//     } catch (error) {
//       console.log("Failed to parse WebSocket message:", error);
//     }
//   });
// });

// const findNearbyDrivers = (userLat, userLon) => {
//   return Object.entries(drivers)
//     .filter(([id, location]) => {
//       const distance = geolib.getDistance(
//         { latitude: userLat, longitude: userLon },
//         location
//       );
//       return distance <= 5000; // 5 kilometers
//     })
//     .map(([id, location]) => ({ id, ...location }));
// };

// // import {connectDB} from '../lib/db.js'
// // const startServer = async () => {
// //   await connectDB()
// //     .then((result) => {
// //       app.listen(ENV.PORT, () => {
// //         console.log(`
// //           🚀 Server is running!
// //           ✅ Environment: ${ENV.NODE_ENV}
// //           ✅ Port: ${ENV.PORT}
// //           ✅ Health check: http://localhost:${ENV.PORT}/api/health
// //           ✅ Root endpoint: http://localhost:${ENV.PORT}/
// //           ✅ Time: ${new Date().toISOString()}
// //           `);
// //       });
// //     })
// //     .catch((err) => {
// //       console.error("Failed to start server:", err);
// //       process.exit(1);
// //     });
// // };

// // startServer();


// // app.listen(PORT, () => {
// //   console.log(`Server is running on port ${PORT}`);
// // });



