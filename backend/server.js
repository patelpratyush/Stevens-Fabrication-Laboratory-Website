import express from 'express';
import cors from 'cors';
import { connectToMongo } from './config/mongoConnection.js';
import { connectToRedis } from './config/redisConnection.js';
import { connectQueue } from './queue/publisher.js';
import { settings } from './config/settings.js';
import authRoutes from './routes/auth.js';
import servicesRoutes from './routes/services.js';
import ordersRoutes from './routes/orders.js';
import equipmentRoutes from './routes/equipment.js';
import checkoutsRoutes from './routes/checkouts.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/checkouts', checkoutsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
async function start() {
  try {
    await connectToMongo();
    await connectToRedis();
    await connectQueue();

    app.listen(settings.server.port, () => {
      console.log(`✓ Server running on http://localhost:${settings.server.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();