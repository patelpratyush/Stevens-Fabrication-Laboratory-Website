import express from 'express';
import { authenticate } from '../middleware/auth.js';
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

export default router;