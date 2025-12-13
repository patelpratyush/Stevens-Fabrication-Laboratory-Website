import express from 'express';
import { authenticate, requireStaff } from '../middleware/auth.js';
import * as orderData from '../data/orders.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const ordersList = req.user.role === 'staff'
      ? await orderData.getAllOrders()
      : await orderData.getOrdersByUser(req.firebaseUid);

    res.json({ orders: ordersList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderData.getOrderById(id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Students can only view their own orders
    if (req.user.role !== 'staff' && order.firebaseUid !== req.firebaseUid) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { items, files, notes } = req.body;

    const order = await orderData.createOrder(
      req.firebaseUid,
      req.user._id,
      { items, files, notes }
    );
    
    // TODO: Queue order for email notification
    
    res.status(201).json({ order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order (staff only) - for status changes, notes, etc.
router.patch('/:id', authenticate, requireStaff, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await orderData.updateOrder(id, req.body);
    
    if (!result) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json({ order: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete order (staff only)
router.delete('/:id', authenticate, requireStaff, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await orderData.deleteOrder(id);
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;