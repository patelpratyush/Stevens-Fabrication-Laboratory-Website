<<<<<<< Updated upstream
import express from "express";
import { authenticate, requireStaff } from "../middleware/auth.js";
import * as equipmentData from "../data/equipment.js";
import { cacheMiddleware, deleteCachePattern, TTL } from "../utils/cache.js";
=======
import express from 'express';
import { authenticate, requireStaff } from '../middleware/auth.js';
import { cacheMiddleware, invalidateCache } from '../middleware/cache.js';
import { CacheKeys, CacheTTL } from '../utils/cache.js';
import * as equipmentData from '../data/equipment.js';
>>>>>>> Stashed changes

const router = express.Router();

// Get all active equipment (public) - CACHED
<<<<<<< Updated upstream
router.get("/", cacheMiddleware("equipment:all", TTL.TEN_MINUTES), async (req, res) => {
  try {
    const equipmentList = await equipmentData.getAllActiveEquipment();
    res.json({ equipment: equipmentList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new equipment (staff only)
router.post("/", authenticate, requireStaff, async (req, res) => {
  try {
    const equipment = await equipmentData.createEquipment(req.body);

    // Invalidate equipment cache
    await deleteCachePattern("equipment:*");

    res.status(201).json({ equipment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update equipment (staff only)
router.patch("/:id", authenticate, requireStaff, async (req, res) => {
  try {
    const { id} = req.params;
    const result = await equipmentData.updateEquipment(id, req.body);

    if (!result) {
      return res.status(404).json({ error: "Equipment not found" });
    }

    // Invalidate equipment cache
    await deleteCachePattern("equipment:*");

    res.json({ equipment: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
=======
router.get('/', 
  cacheMiddleware(CacheKeys.equipmentActive(), CacheTTL.EQUIPMENT),
  async (req, res) => {
    try {
      const equipmentList = await equipmentData.getAllActiveEquipment();
      res.json({ equipment: equipmentList });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
>>>>>>> Stashed changes
  }
);

// Create new equipment (staff only) - INVALIDATES CACHE
router.post('/', 
  authenticate, 
  requireStaff,
  invalidateCache(CacheKeys.equipmentAll()),
  async (req, res) => {
    try {
      const equipment = await equipmentData.createEquipment(req.body);
      res.status(201).json({ equipment });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Update equipment (staff only) - INVALIDATES CACHE
router.patch('/:id', 
  authenticate, 
  requireStaff,
  invalidateCache(CacheKeys.equipmentAll()),
  async (req, res) => {
    try {
      const { id } = req.params;
      const result = await equipmentData.updateEquipment(id, req.body);

      if (!result) {
        return res.status(404).json({ error: 'Equipment not found' });
      }

      res.json({ equipment: result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;