import express from 'express';
import cors from 'cors';
import v1Router from './routes/v1';
import { env } from './config/env';
import { errorHandler } from './shared/middleware/error-handler';
import { notFoundHandler } from './shared/middleware/not-found';

const app = express();

// Middleware
app.use(cors({
    origin: env.frontendUrl,
    credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/v1', v1Router);
app.use('/', v1Router);

// Basic health check
app.get('/', (req, res) => {
    res.json({
        message: 'EzeQ backend is running',
        version: 'v1',
        timestamp: new Date().toISOString()
    });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
