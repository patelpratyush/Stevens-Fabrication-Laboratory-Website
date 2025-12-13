import express from 'express';
import { authenticate, requireStaff } from '../middleware/auth.js';
import * as serviceData from '../data/services.js';

const router = express.Router();

// Get all active services (public)
router.get('/', async (req, res) => {
  try {
    const servicesList = await serviceData.getAllActiveServices();
    res.json({ services: servicesList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new service/material (staff only)
router.post('/', authenticate, requireStaff, async (req, res) => {
  try {
    const service = await serviceData.createService(req.body);
    res.status(201).json({ service });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update service/material (staff only)
router.patch('/:id', authenticate, requireStaff, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await serviceData.updateService(id, req.body);

    if (!result) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json({ service: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;