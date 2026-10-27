import express, { Request, Response } from 'express';
import cors from "cors";

import authRoutes from './routes/auth';
import listingsRoutes from './routes/listings';
import bookingsRoutes from './routes/bookings';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/listings', listingsRoutes);
app.use('/bookings', bookingsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});