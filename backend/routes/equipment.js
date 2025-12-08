import express from 'express';
import { equipment } from '../config/mongoCollections.js';

const router = express.Router();

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

export default router;