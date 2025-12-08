import { firebaseAuth } from '../config/firebaseConnection.js';
import { users } from '../config/mongoCollections.js';

export async function authenticate(req, res, next) {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = await firebaseAuth.verifyIdToken(token);
    const usersCollection = await users();
    const user = await usersCollection.findOne({ 
      firebaseUid: decodedToken.uid 
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    req.user = user;
    req.firebaseUid = decodedToken.uid;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

export function requireStaff(req, res, next) {
  if (req.user.role !== 'staff') {
    return res.status(403).json({ error: 'Staff access required' });
  }
  next();
}