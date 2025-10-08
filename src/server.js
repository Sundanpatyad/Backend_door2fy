import express from 'express';
import cluster from 'cluster';
import os from 'os';
import config from './config/config.js';
import logger from './middleware/logger.js';
import serviceRoutes from './routes/serviceRoutes.js';
import authRoutes from './routes/authRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import cors from 'cors';
import { isFirebaseConnected } from './config/firebase.js';
import engineerRoutes from './routes/engineerRoutes.js';
// Load environment variables
dotenv.config();

// Get number of CPU cores
const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Master process ${process.pid} is running`);
  console.log(`Starting ${numCPUs} workers...`);

  // Check Firebase connection before forking workers
  console.log("Firebase connected:", isFirebaseConnected);
  
  if (!isFirebaseConnected) {
    console.error("Firebase Admin not connected. Cannot start server.");
    process.exit(1);
  }

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Listen for worker exit events
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died with code ${code} and signal ${signal}`);
    console.log('Starting a new worker...');
    cluster.fork();
  });

  // Listen for worker online events
  cluster.on('online', (worker) => {
    console.log(`Worker ${worker.process.pid} is online`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('Master process received SIGTERM, shutting down gracefully...');
    
    for (const id in cluster.workers) {
      cluster.workers[id].kill('SIGTERM');
    }
    
    setTimeout(() => {
      console.log('Force shutting down...');
      process.exit(1);
    }, 10000);
  });

  process.on('SIGINT', () => {
    console.log('Master process received SIGINT, shutting down gracefully...');
    
    for (const id in cluster.workers) {
      cluster.workers[id].kill('SIGINT');
    }
    
    setTimeout(() => {
      console.log('Force shutting down...');
      process.exit(1);
    }, 10000);
  });

} else {
  // Worker process
  console.log(`Worker process ${process.pid} started`);

  // Connect to database in each worker
  connectDB();

  const app = express();

  // Middleware
app.use(cors({ origin: '*', credentials: true }));

  app.use(express.json());
  app.use(logger);

  // Routes
  app.use('/api/services', serviceRoutes);
  app.use('/api/payment', paymentRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/engineer', engineerRoutes);
  app.get('/', (req, res) => {
    res.send(`Node.js Backend is running! Worker PID: ${process.pid}`);
  });

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      worker: process.pid,
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(`Worker ${process.pid} error:`, err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  });

  // Start server
  const server = app.listen(config.port, () => {
    console.log(`Worker ${process.pid} server running on port ${config.port}`);
  });

  // Graceful shutdown for workers
  const gracefulShutdown = (signal) => {
    console.log(`Worker ${process.pid} received ${signal}, shutting down gracefully...`);
    
    server.close(() => {
      console.log(`Worker ${process.pid} HTTP server closed`);
      process.exit(0);
    });

    // Force close after 10 seconds
    setTimeout(() => {
      console.log(`Worker ${process.pid} force shutdown`);
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // Handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    console.error(`Worker ${process.pid} uncaught exception:`, err);
    process.exit(1);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error(`Worker ${process.pid} unhandled rejection at:`, promise, 'reason:', reason);
    process.exit(1);
  });
}