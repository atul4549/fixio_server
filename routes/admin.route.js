// server.js or api route
import express from 'express';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import {Clerk} from '@clerk/clerk-sdk-node';

const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });
// const clerk = ''
const router = express.Router();

// Get all users
router.get('/users', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const users = await clerk.users.getUserList({
      limit: 100, // Max 100 per request
      orderBy: '-created_at', // Sort by creation date
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by ID
router.get('/users/:id', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const user = await clerk.users.getUser(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: 'User not found' });
  }
});

export {router as adminRoutes}
// module.exports = router;