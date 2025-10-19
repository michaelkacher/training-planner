import { FastifyInstance } from 'fastify';
import { registerWorkoutRoutes } from './workouts.js';
import { registerTrainingPlanRoutes } from './training-plans.js';

export function registerRoutes(fastify: FastifyInstance) {
  // API version prefix
  fastify.register(async (app) => {
    // Register workout routes
    registerWorkoutRoutes(app);

    // Register training plan routes
    registerTrainingPlanRoutes(app);

    // Placeholder routes - will be implemented later
    app.get('/athletes', async (request, reply) => {
      return { message: 'Athletes endpoint - coming soon!' };
    });

    app.get('/schedules', async (request, reply) => {
      return { message: 'Schedules endpoint - coming soon!' };
    });
  }, { prefix: '/api/v1' });
}
