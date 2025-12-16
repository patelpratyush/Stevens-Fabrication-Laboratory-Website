import express from 'express';
import { authenticate, requireStaff } from '../middleware/auth.js';
import { cacheMiddleware, invalidateCache } from '../middleware/cache.js';
import { CacheKeys, CacheTTL } from '../utils/cache.js';
import * as serviceData from '../data/services.js';

const router = express.Router();

// Get services - staff sees all, public sees only active
// Note: authenticate middleware is optional - if user is logged in, req.user will be set
router.get('/', async (req, res) => {
  try {
    // Try to authenticate if token is present, but don't require it
    // This allows both public and authenticated requests
    let isStaff = false;
    
    // Check if Authorization header exists
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        // If we have a token, verify it to get user info
        const token = authHeader.split('Bearer ')[1];
        const { admin } = await import('firebase-admin');
        const decodedToken = await admin.auth().verifyIdToken(token);
        
        // Get user from database to check role
        const { getUserByFirebaseUid } = await import('../data/users.js');
        const user = await getUserByFirebaseUid(decodedToken.uid);
        
        if (user && user.role === 'staff') {
          isStaff = true;
        }
      } catch (err) {
        // If token verification fails, just treat as public request
        console.log('Token verification failed, treating as public request');
      }
    }
    
    const servicesList = isStaff 
      ? await serviceData.getAllServices()  // Staff sees ALL services (including inactive)
      : await serviceData.getAllActiveServices();  // Public sees only active services
      
    res.json({ services: servicesList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new service/material (staff only) - INVALIDATES CACHE
router.post('/', 
  authenticate, 
  requireStaff, 
  invalidateCache(CacheKeys.servicesAll()),
  async (req, res) => {
    try {
      const service = await serviceData.createService(req.body);
      res.status(201).json({ service });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Update service/material (staff only) - INVALIDATES CACHE
router.patch('/:id', 
  authenticate, 
  requireStaff,
  invalidateCache(CacheKeys.servicesAll()),
  async (req, res) => {
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
  }
);

// Delete service (staff only) - INVALIDATES CACHE
// This is a HARD delete that sets active: false (soft delete in DB)
router.delete('/:id',
  authenticate,
  requireStaff,
  invalidateCache(CacheKeys.servicesAll()),
  async (req, res) => {
    try {
      const { id } = req.params;
      const result = await serviceData.deleteService(id);

      if (!result || result.modifiedCount === 0) {
        return res.status(404).json({ error: 'Service not found' });
      }

      res.json({ message: 'Service deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;