import express from 'express';
import * as userData from '../data/users.js';

const router = express.Router();

// Staff emails list - CONTROLLED BY BACKEND
const STAFF_EMAILS = [
  'kbyrne3@stevens.edu',  // Lab staff
  // Add more staff emails here
];

router.post('/register', async (req, res) => {
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
});

export default router;