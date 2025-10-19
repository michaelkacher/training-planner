import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import dotenv from 'dotenv';
import { registerRoutes } from './routes/index.js';

dotenv.config();

const fastify = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname'
      }
    }
  }
});

// Register JWT
await fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
});

// Register CORS
await fastify.register(cors, {
  origin: (origin, cb) => {
    // Allow all localhost origins in development
    if (!origin || origin.startsWith('http://localhost:')) {
      cb(null, true);
      return;
    }
    // In production, only allow specific origin
    const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
    cb(null, origin === allowedOrigin);
  },
  credentials: true
});

// Register routes
registerRoutes(fastify);

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Start server
const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3000;
    const host = process.env.HOST || '0.0.0.0';

    await fastify.listen({ port, host });
    console.log(`\n🚀 Backend server running at http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
