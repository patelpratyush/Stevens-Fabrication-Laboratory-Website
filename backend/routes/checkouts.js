import express from 'express';
import { authenticate, requireStaff } from '../middleware/auth.js';
import { invalidateCache } from '../middleware/cache.js';
import { CacheKeys } from '../utils/cache.js';
import * as checkoutData from '../data/checkouts.js';

const router = express.Router();

// Get student's own checkouts
router.get('/me', authenticate, async (req, res) => {
  try {
    const userCheckouts = await checkoutData.getCheckoutsByUser(req.firebaseUid);
    res.json({ checkouts: userCheckouts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Student creates a checkout request
router.post('/request', authenticate, async (req, res) => {
  try {
    const { equipmentId, dueDate, notes } = req.body;

    const checkout = await checkoutData.createCheckoutRequest({
      equipmentId,
      firebaseUid: req.firebaseUid,
      dueDate,
      notes
    });

    res.status(201).json({ checkout });
  } catch (error) {
    if (error.message === 'Equipment not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'Equipment is not available for checkout requests') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

// Get all checkouts (staff only)
router.get('/', authenticate, requireStaff, async (req, res) => {
  try {
    const { status } = req.query;
    
    let checkoutsList;
    if (status === 'pending') {
      checkoutsList = await checkoutData.getPendingCheckouts();
    } else if (status === 'approved') {
      checkoutsList = await checkoutData.getApprovedCheckouts();
    } else {
      checkoutsList = await checkoutData.getAllCheckouts();
    }

    res.json({ checkouts: checkoutsList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Staff approves checkout request - INVALIDATES EQUIPMENT CACHE
router.post('/:id/approve', 
  authenticate, 
  requireStaff,
  invalidateCache(CacheKeys.equipmentAll()),
  async (req, res) => {
    try {
      const { id } = req.params;
      const checkout = await checkoutData.approveCheckout(id);

      res.json({ checkout });
    } catch (error) {
      if (error.message === 'Checkout not found' || error.message === 'Equipment not found') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === 'Only pending checkouts can be approved' || 
          error.message.includes('Equipment is no longer available') ||
          error.message.includes('earlier pending requests')) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }
);

// Staff denies checkout request
router.post('/:id/deny', authenticate, requireStaff, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const checkout = await checkoutData.denyCheckout(id, reason);

    res.json({ checkout });
  } catch (error) {
    if (error.message === 'Checkout not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'Only pending checkouts can be denied') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

// Staff marks checkout as returned - INVALIDATES EQUIPMENT CACHE
router.post('/:id/return', 
  authenticate, 
  requireStaff,
  invalidateCache(CacheKeys.equipmentAll()),
  async (req, res) => {
    try {
      const { id } = req.params;
      const checkout = await checkoutData.returnCheckout(id);

      res.json({ checkout });
    } catch (error) {
      if (error.message === 'Checkout not found') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === 'Only approved checkouts can be returned') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }
);

// Update checkout details (staff only) - for editing due dates, notes, etc.
router.patch('/:id', authenticate, requireStaff, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await checkoutData.updateCheckout(id, req.body);

    res.json({ checkout: result });
  } catch (error) {
    if (error.message === 'Checkout not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

export default router;