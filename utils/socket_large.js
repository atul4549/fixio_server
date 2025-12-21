// import { Server } from "socket.io";
// import http from "http";
// import express from "express";
// import { ENV } from "../lib/env";

// const app = express();
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: ENV.CLIENT_URL,
//     credentials: true,
//   },

//   //------------------------------------------------------ TODO: NEW
//   connectionStateRecovery: {
//     maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
//     skipMiddlewares: true,
//   },
//   //------------------------------------------------------ TODO: NEW
// });

// export function getReceiverSocketId(userId) {
//   return userSocketMap[userId];
// }

// // used to store online users
// const userSocketMap = {}; // {userId: socketId}

// io.on("connection", (socket) => {
//   console.log("A user connected", socket.id);
  
//   const userId = socket.handshake.query.userId;
//   if (userId) {
//     userSocketMap[userId] = socket.id
//     // if (userId) {
//       socket.join(userId);
//       console.log(`User ${userId} connected`);
//       // }
//       //------------------------------------------------------ TODO: NEW

// // Send pending requests to user on connection
// const userRequests = Array.from(activeRequests.values())
// .filter(req => req.userId === userId && req.status === 'pending');

// if (userRequests.length > 0) {
// socket.emit('pending-requests', userRequests);
// }

//       //------------------------------------------------------ TODO: NEW
//     };
    
//   // io.emit() is used to send events to all the connected clients
//   io.emit("getOnlineUsers", Object.keys(userSocketMap));

//   socket.on('send-request', (data) => {
//     console.log('Received request:', data);
    
//     // Process the request...
    
//     // Send confirmation back to client
//     socket.emit('request-confirmed', {
//       message: 'Your request has been processed',
//       timestamp: new Date().toISOString()
//     });
    
//     // Or broadcast to other users
//     // socket.broadcast.emit('new-request', data);
//     //------------------------------------------------------ TODO: NEW
//     // Generate unique request ID
//     const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
//     const newRequest = {
//       id: requestId,
//       userId: data.userId,
//       data: data.data,
//       status: 'pending',
//       timestamp: new Date(),
//     };
    
//     // Store the request
//      activeRequests.set(requestId, newRequest);
      
//      // Notify the user who sent the request
//      socket.emit('request-sent-success', {
//       requestId,
//       message: 'Request sent successfully! Waiting for acceptance.',
//       timestamp: new Date().toISOString(),
//     });

//      // Broadcast to all admins or specific users who can accept requests
//      io.emit('new-request', {
//       requestId,
//       userId: data.userId,
//       data: data.data,
//       timestamp: new Date().toISOString(),
//     });

//     console.log(`New request ${requestId} created by user ${data.userId}`);
//     //------------------------------------------------------ TODO: NEW
//   });

// // Handle request acceptance
// socket.on('accept-request', (data) => {
//   const { requestId, acceptedBy, response } = data;
//   const request = activeRequests.get(requestId);
  
//   if (!request) {
//     socket.emit('error', { message: 'Request not found' });
//     return;
//   }
  
//   if (request.status !== 'pending') {
//     socket.emit('error', { 
//       message: `Request already ${request.status}` 
//     });
//     return;
//   }
  
//   // Update request status
//   request.status = 'accepted';
//   request.acceptedBy = acceptedBy;
//   activeRequests.set(requestId, request);
  
//   // Notify the original requester
//   io.to(request.userId).emit('request-accepted', {
//     requestId,
//     acceptedBy,
//     response,
//     message: 'Your request has been accepted!',
//     timestamp: new Date().toISOString(),
//   });
  
//   // Notify the acceptor
//   socket.emit('acceptance-success', {
//     requestId,
//     message: 'Request accepted successfully!',
//     userId: request.userId,
//   });
  
//   // Broadcast to all connected users (optional)
//   io.emit('request-updated', {
//     requestId,
//     status: 'accepted',
//     userId: request.userId,
//     acceptedBy,
//   });
  
//   console.log(`Request ${requestId} accepted by ${acceptedBy}`);
// });


// // Handle request rejection
// socket.on('reject-request', (data) => {
//   const { requestId, rejectedBy, reason } = data;
//   const request = activeRequests.get(requestId);
  
//   if (!request) {
//     socket.emit('error', { message: 'Request not found' });
//     return;
//   }
  
//   request.status = 'rejected';
//   activeRequests.set(requestId, request);
  
//   // Notify the original requester
//   io.to(request.userId).emit('request-rejected', {
//     requestId,
//     rejectedBy,
//     reason,
//     message: 'Your request has been rejected.',
//     timestamp: new Date().toISOString(),
//   });
  
//   console.log(`Request ${requestId} rejected by ${rejectedBy}`);
// });

// // Handle request status check
// socket.on('check-request', (data) => {
//   const request = activeRequests.get(data.requestId);
//   if (request) {
//     socket.emit('request-status', {
//       requestId: data.requestId,
//       status: request.status,
//       ...(request.acceptedBy && { acceptedBy: request.acceptedBy }),
//       timestamp: request.timestamp,
//     });
//   } else {
//     socket.emit('request-status', {
//       requestId: data.requestId,
//       status: 'not_found',
//     });
//   }
// });


//   socket.on("disconnect", () => {
//     console.log("A user disconnected", socket.id);
//     console.log(`User ${userId} disconnected: ${reason}`);
//     delete userSocketMap[userId];
//     io.emit("getOnlineUsers", Object.keys(userSocketMap));
//   });
// });

// export { io, app, server };



// export const getIO = () => {
//   if (!io) {
//     throw new Error('Socket.io not initialized');
//   }
//   return io;
// };

// // Helper function to get active requests
// export const getActiveRequests = () => {
//   return Array.from(activeRequests.values());
// };

// // Helper function to get requests by user
// export const getUserRequests = (userId) => {
//   return Array.from(activeRequests.values())
//     .filter(req => req.userId === userId);
// };

