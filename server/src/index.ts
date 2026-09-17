/**
 * NordStay API Server
 * 
 * Main entry point for the Express server.
 * Sets up middleware, routes, and starts the server.
 */

import express, { Request, Response } from 'express';
import cors from "cors";

// Import route handlers
import authRoutes from './routes/auth';
import listingsRoutes from './routes/listings';
import bookingsRoutes from './routes/bookings';

const app = express();
const PORT = 4000;

// ============================================
// Middleware Setup
// ============================================

// CORS: Allow requests from the frontend (React app)
app.use(cors());

// JSON parser: Parse request bodies as JSON
app.use(express.json());

// ============================================
// Routes
// ============================================

// Health check endpoint
// Useful for monitoring and testing
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Root/welcome endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'NordStay API running',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: {
        register: 'POST /auth/register',
        login: 'POST /auth/login',
      },
      listings: {
        getAll: 'GET /listings',
        getOne: 'GET /listings/:id',
      },
      bookings: {
        create: 'POST /bookings (requires auth)',
        getMine: 'GET /bookings/me (requires auth)',
      },
    },
  });
});

// Authentication routes (register, login)
app.use('/auth', authRoutes);

// Listings routes (get all, get one)
app.use('/listings', listingsRoutes);

// Bookings routes (create, get mine) - all require authentication
app.use('/bookings', bookingsRoutes);

// ============================================
// Start Server
// ============================================

app.listen(PORT, () => {
  console.log(`\n🚀 NordStay API Server running at http://localhost:${PORT}\n`);
  console.log('Available endpoints:');
  console.log('  GET  /health           - Health check');
  console.log('  GET  /                 - API info');
  console.log('  POST /auth/register     - Register new user');
  console.log('  POST /auth/login        - Login user');
  console.log('  GET  /listings          - Get all listings');
  console.log('  GET  /listings/:id      - Get one listing');
  console.log('  POST /bookings          - Create booking (auth required)');
  console.log('  GET  /bookings/me       - Get my bookings (auth required)\n');
});

