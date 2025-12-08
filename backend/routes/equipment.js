import express from 'express';
import { ObjectId } from 'mongodb';
import { equipment } from '../config/mongoCollections.js';
import { authenticate, requireStaff } from '../middleware/auth.js';

const router = express.Router();

// Get all active equipment (public)
router.get('/', async (req, res) => {
  try {
    const equipmentCollection = await equipment();
    const equipmentList = await equipmentCollection
      .find({ active: true })
      .toArray();

    res.json({ equipment: equipmentList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update equipment (staff only)
router.patch('/:id', authenticate, requireStaff, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const equipmentCollection = await equipment();

    // Remove fields that shouldn't be updated directly
    delete updates._id;
    delete updates.createdAt;

    updates.updatedAt = new Date();

    const result = await equipmentCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updates },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    res.json({ equipment: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;