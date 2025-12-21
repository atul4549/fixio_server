// pages/api/friend-requests/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';

interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  receiverName: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
}

// Mock database
const friendRequests: FriendRequest[] = [];
const friendships: Record<string, string[]> = {}; // userId -> friendIds

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  switch (req.method) {
    case 'POST':
      const { receiverId } = req.body;
      
      // Check if request already exists
      const existingRequest = friendRequests.find(
        req => req.senderId === userId && req.receiverId === receiverId && req.status === 'pending'
      );
      
      if (existingRequest) {
        return res.status(400).json({ error: 'Friend request already sent' });
      }

      // Check if already friends
      if (friendships[userId]?.includes(receiverId)) {
        return res.status(400).json({ error: 'Already friends' });
      }

      // Create new request
      const newRequest: FriendRequest = {
        id: `req_${Date.now()}`,
        senderId: userId,
        receiverId,
        senderName: 'Current User', // Get from DB
        receiverName: 'Receiver User', // Get from DB
        status: 'pending',
        createdAt: new Date(),
      };

      friendRequests.push(newRequest);

      // Emit socket event
      req.io?.to(receiverId).emit('friend_request', {
        id: newRequest.id,
        type: 'friend_request',
        title: 'New Friend Request',
        message: `${newRequest.senderName} sent you a friend request`,
        senderId: userId,
        senderName: newRequest.senderName,
        metadata: { requestId: newRequest.id },
        status: 'pending',
        createdAt: new Date(),
      });

      return res.status(201).json(newRequest);

    case 'GET':
      const userRequests = friendRequests.filter(
        req => req.receiverId === userId && req.status === 'pending'
      );
      return res.status(200).json(userRequests);

    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

// pages/api/friend-requests/[requestId]/accept.ts
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);
  const { requestId } = req.query;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const request = friendRequests.find(req => req.id === requestId);
  
  if (!request) {
    return res.status(404).json({ error: 'Request not found' });
  }

  if (request.receiverId !== userId) {
    return res.status(403).json({ error: 'Not authorized to accept this request' });
  }

  request.status = 'accepted';

  // Add to friendships
  if (!friendships[request.senderId]) friendships[request.senderId] = [];
  if (!friendships[request.receiverId]) friendships[request.receiverId] = [];

  friendships[request.senderId].push(request.receiverId);
  friendships[request.receiverId].push(request.senderId);

  // Emit socket events
  req.io?.to(request.senderId).emit('friend_request_accepted', {
    requestId: request.id,
    senderId: request.senderId,
    receiverId: request.receiverId,
    senderName: request.senderName,
    receiverName: request.receiverName,
  });

  req.io?.to(request.receiverId).emit('notification', {
    id: `accept_${Date.now()}`,
    type: 'request_accepted',
    title: 'Friend Request Accepted',
    message: `You accepted ${request.senderName}'s friend request`,
    senderId: request.senderId,
    senderName: request.senderName,
    status: 'read',
    createdAt: new Date(),
  });

  return res.status(200).json({ message: 'Friend request accepted' });
}

// pages/api/friend-requests/[requestId]/decline.ts
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);
  const { requestId } = req.query;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const request = friendRequests.find(req => req.id === requestId);
  
  if (!request) {
    return res.status(404).json({ error: 'Request not found' });
  }

  if (request.receiverId !== userId) {
    return res.status(403).json({ error: 'Not authorized to decline this request' });
  }

  request.status = 'declined';

  // Emit socket event
  req.io?.to(request.senderId).emit('friend_request_declined', {
    requestId: request.id,
    senderId: request.senderId,
    receiverId: request.receiverId,
  });

  return res.status(200).json({ message: 'Friend request declined' });
}

// pages/api/users/[userId]/notifications.ts
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);
  const { userId: paramUserId } = req.query;

  if (!userId || userId !== paramUserId) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      // Return user notifications
      const userNotifications = []; // Get from DB
      return res.status(200).json(userNotifications);

    case 'DELETE':
      // Clear all notifications
      return res.status(200).json({ message: 'All notifications cleared' });

    case 'PATCH':
      if (req.url?.includes('read-all')) {
        // Mark all as read
        return res.status(200).json({ message: 'All notifications marked as read' });
      }

    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}




























