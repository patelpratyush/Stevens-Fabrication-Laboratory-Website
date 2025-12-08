import express from 'express';
import { ObjectId } from 'mongodb';
import { services } from '../config/mongoCollections.js';
import { authenticate, requireStaff } from '../middleware/auth.js';

const router = express.Router();

// Get all active services (public)
router.get('/', async (req, res) => {
  try {
    const servicesCollection = await services();
    const servicesList = await servicesCollection
      .find({ active: true })
      .toArray();

    res.json({ services: servicesList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new service/material (staff only)
router.post('/', authenticate, requireStaff, async (req, res) => {
  try {
    const {
      name,
      category,
      type,
      status,
      description,
      priceType,
      basePrice,
      pricePerUnit,
      unitLabel,
      laserMetadata
    } = req.body;

    const servicesCollection = await services();

    const service = {
      name,
      category,
      type,
      status: status || 'available',
      description,
      priceType,
      basePrice: basePrice || 0,
      pricePerUnit: pricePerUnit || 0,
      unitLabel,
      laserMetadata: laserMetadata || {},
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await servicesCollection.insertOne(service);
    service._id = result.insertedId;

    res.status(201).json({ service });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update service/material (staff only)
router.patch('/:id', authenticate, requireStaff, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const servicesCollection = await services();

    // Remove fields that shouldn't be updated directly
    delete updates._id;
    delete updates.createdAt;

    updates.updatedAt = new Date();

    const result = await servicesCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updates },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json({ service: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
