import express from 'express';
import { invalidateCache } from '../middleware/cache.js';
import { CacheKeys } from '../utils/cache.js';
import * as userData from '../data/users.js';

const router = express.Router();

// Staff emails list - CONTROLLED BY BACKEND
const STAFF_EMAILS = [
  'staff@stevens.edu',    // Test staff account
  'ppatel10@stevens.edu', // Pratyush Patel (Team)
  'jcairns@stevens.edu',  // Jasmine Cairns (Team)
  'damin@stevens.edu',    // David Amin (Team)
  // Add more staff emails here
];

// Register/Login - INVALIDATES USER CACHE if new user or role change
router.post('/register', 
  invalidateCache((req) => CacheKeys.user(req.body.firebaseUid)),
  async (req, res) => {
    try {
      const { firebaseUid, email, name } = req.body;

      const existingUser = await userData.getUserByFirebaseUid(firebaseUid);

      if (existingUser) {
        return res.json({ user: existingUser });
      }

      // Backend determines role based on email
      const role = STAFF_EMAILS.includes(email.toLowerCase()) ? 'staff' : 'student';

      const user = await userData.createUser({
        firebaseUid,
        email,
        name,
        role
      });

      res.status(201).json({ user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;