import express from 'express';
import { ObjectId } from 'mongodb';
import { orders, services } from '../config/mongoCollections.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const ordersCollection = await orders();
    const filter = req.user.role === 'staff' 
      ? {} 
      : { firebaseUid: req.firebaseUid };
    
    const ordersList = await ordersCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();
    
    res.json({ orders: ordersList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { items, files, notes } = req.body;
    const servicesCollection = await services();
    const ordersCollection = await orders();

    // Calculate price
    let totalPrice = 0;
    for (const item of items) {
      const service = await servicesCollection.findOne({
        _id: new ObjectId(item.serviceId)
      });
      if (service) {
        const lineTotal = (service.pricePerUnit || 0) * (item.quantity || 1);
        item.unitPrice = lineTotal / item.quantity;
        item.lineTotal = lineTotal;
        totalPrice += lineTotal;
      }
    }

    // Generate order number
    const orderCount = await ordersCollection.countDocuments();
    const orderNumber = `FAB-${new Date().getFullYear()}-${String(orderCount + 1).padStart(4, '0')}`;

    const order = {
      orderNumber,
      firebaseUid: req.firebaseUid,
      userId: req.user._id,
      items,
      files: files || [],
      totalPrice,
      status: 'submitted',
      notes: notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await ordersCollection.insertOne(order);
    
    // TODO: Queue order for email notification
    
    res.status(201).json({ order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;