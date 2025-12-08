import express from 'express';
import { users } from '../config/mongoCollections.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { firebaseUid, email, name, role } = req.body;
    
    const usersCollection = await users();
    const existingUser = await usersCollection.findOne({ firebaseUid });
    
    if (existingUser) {
      return res.json({ user: existingUser });
    }

    const user = {
      firebaseUid,
      email,
      name,
      role: role || 'student',
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
