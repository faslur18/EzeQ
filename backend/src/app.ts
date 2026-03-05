import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './auth/auth.routes';
import salonRoutes from './salons/salons.routes';
import serviceRoutes from './services/services.routes';
import hourRoutes from './hours/hours.routes';
import appointmentRoutes from './appointments/appointments.routes';
import userRoutes from './users/users.routes';
// import adminSalonRoutes from './admin-salons/admin-salons.routes';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/salons', salonRoutes);
app.use('/salons', serviceRoutes);
app.use('/salons', hourRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/users', userRoutes);
// app.use('/admin-salons', adminSalonRoutes);

// Basic health check
app.get('/', (req, res) => {
    res.json({
        message: 'EzeQ Express Backend is running',
        timestamp: new Date().toISOString()
    });
});

export default app;
