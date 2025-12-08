import express from 'express';
import { ObjectId } from 'mongodb';
import { checkouts, equipment } from '../config/mongoCollections.js';
import { authenticate, requireStaff } from '../middleware/auth.js';

const router = express.Router();

// Get student's own checkouts
router.get('/me', authenticate, async (req, res) => {
  try {
    const checkoutsCollection = await checkouts();
    const userCheckouts = await checkoutsCollection
      .find({ firebaseUid: req.firebaseUid })
      .sort({ checkoutDate: -1 })
      .toArray();

    res.json({ checkouts: userCheckouts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all checkouts (staff only)
router.get('/', authenticate, requireStaff, async (req, res) => {
  try {
    const checkoutsCollection = await checkouts();
    const allCheckouts = await checkoutsCollection
      .find({})
      .sort({ checkoutDate: -1 })
      .toArray();

    res.json({ checkouts: allCheckouts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create checkout (staff only)
router.post('/', authenticate, requireStaff, async (req, res) => {
  try {
    const { equipmentId, userId, dueDate, notes } = req.body;

    const checkoutsCollection = await checkouts();
    const equipmentCollection = await equipment();

    // Check if equipment exists and is available
    const equipmentItem = await equipmentCollection.findOne({
      _id: new ObjectId(equipmentId)
    });

    if (!equipmentItem) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    if (equipmentItem.status !== 'available') {
      return res.status(400).json({ error: 'Equipment is not available' });
    }

    const checkout = {
      equipmentId: new ObjectId(equipmentId),
      userId: userId,
      firebaseUid: userId, // Assuming userId is firebaseUid for now
      checkoutDate: new Date(),
      dueDate: new Date(dueDate),
      returnedDate: null,
      status: 'active',
      notes: notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await checkoutsCollection.insertOne(checkout);

    // Update equipment status to checked_out
    await equipmentCollection.updateOne(
      { _id: new ObjectId(equipmentId) },
      {
        $set: {
          status: 'checked_out',
          updatedAt: new Date()
        }
      }
    );

    res.status(201).json({ checkout });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update checkout (staff only)
router.patch('/:id', authenticate, requireStaff, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const checkoutsCollection = await checkouts();
    const equipmentCollection = await equipment();

    // Remove fields that shouldn't be updated directly
    delete updates._id;
    delete updates.createdAt;
    delete updates.equipmentId;

    updates.updatedAt = new Date();

    // Convert date strings to Date objects
    if (updates.dueDate) {
      updates.dueDate = new Date(updates.dueDate);
    }
    if (updates.returnedDate) {
      updates.returnedDate = new Date(updates.returnedDate);
    }

    const checkout = await checkoutsCollection.findOne({
      _id: new ObjectId(id)
    });

    if (!checkout) {
      return res.status(404).json({ error: 'Checkout not found' });
    }

    const result = await checkoutsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updates },
      { returnDocument: 'after' }
    );

    // If checkout is being returned, update equipment status
    if (updates.status === 'returned' || updates.returnedDate) {
      await equipmentCollection.updateOne(
        { _id: checkout.equipmentId },
        {
          $set: {
            status: 'available',
            updatedAt: new Date()
          }
        }
      );
    }

    res.json({ checkout: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
