import express from 'express';
import { users } from '../config/mongoCollections.js';

const router = express.Router();

// Staff emails list - CONTROLLED BY BACKEND
const STAFF_EMAILS = [
  'kbyrne3@stevens.edu',  // Lab staff
  // Add more staff emails here
];

router.post('/register', async (req, res) => {
  try {
    const { firebaseUid, email, name } = req.body;

    const usersCollection = await users();
    const existingUser = await usersCollection.findOne({ firebaseUid });

    if (existingUser) {
      return res.json({ user: existingUser });
    }

    // Backend determines role based on email
    const role = STAFF_EMAILS.includes(email.toLowerCase()) ? 'staff' : 'student';

    const user = {
      firebaseUid,
      email,
      name,
      role,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await usersCollection.insertOne(user);
    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
