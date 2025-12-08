import express from 'express';
import { services } from '../config/mongoCollections.js';

const router = express.Router();

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

export default router;
