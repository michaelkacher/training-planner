import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { supabase, isDbConnected } from '../config/supabase.js';
import type { Workout, CreateWorkoutDTO, UpdateWorkoutDTO } from '../types/index.js';

// In-memory storage for mock mode
let mockWorkouts: Workout[] = [];

interface CreateWorkoutRequest {
  Body: CreateWorkoutDTO & { athlete_id: string };
}

interface UpdateWorkoutRequest {
  Params: { id: string };
  Body: UpdateWorkoutDTO;
}

interface GetWorkoutsRequest {
  Querystring: { athlete_id?: string };
}

export function registerWorkoutRoutes(fastify: FastifyInstance) {
  // Get all workouts (optionally filtered by athlete_id)
  fastify.get<GetWorkoutsRequest>(
    '/workouts',
    async (request: FastifyRequest<GetWorkoutsRequest>, reply: FastifyReply) => {
      const { athlete_id } = request.query;

      // Mock mode - return in-memory data
      if (!isDbConnected || !supabase) {
        let filtered = mockWorkouts;
        if (athlete_id) {
          filtered = mockWorkouts.filter(w => w.athlete_id === athlete_id);
        }
        return reply.send(filtered);
      }

      // Database mode
      let query = supabase.from('workouts').select('*');

      if (athlete_id) {
        query = query.eq('athlete_id', athlete_id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        return reply.status(500).send({ error: error.message });
      }

      return reply.send(data);
    }
  );

  // Get single workout by ID
  fastify.get<{ Params: { id: string } }>(
    '/workouts/:id',
    async (request, reply) => {
      const { id } = request.params;

      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return reply.status(404).send({ error: 'Workout not found' });
      }

      return reply.send(data);
    }
  );

  // Create new workout
  fastify.post<CreateWorkoutRequest>(
    '/workouts',
    async (request: FastifyRequest<CreateWorkoutRequest>, reply: FastifyReply) => {
      const workoutData = request.body;

      // Mock mode - store in memory
      if (!isDbConnected || !supabase) {
        const newWorkout: Workout = {
          id: `mock-${Date.now()}`,
          ...workoutData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        mockWorkouts.unshift(newWorkout);
        return reply.status(201).send(newWorkout);
      }

      // Database mode
      const { data, error} = await supabase
        .from('workouts')
        .insert([workoutData])
        .select()
        .single();

      if (error) {
        return reply.status(400).send({ error: error.message });
      }

      return reply.status(201).send(data);
    }
  );

  // Update workout
  fastify.put<UpdateWorkoutRequest>(
    '/workouts/:id',
    async (request: FastifyRequest<UpdateWorkoutRequest>, reply: FastifyReply) => {
      const { id } = request.params;
      const updates = request.body;

      const { data, error } = await supabase
        .from('workouts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return reply.status(400).send({ error: error.message });
      }

      return reply.send(data);
    }
  );

  // Delete workout
  fastify.delete<{ Params: { id: string } }>(
    '/workouts/:id',
    async (request, reply) => {
      const { id } = request.params;

      // Mock mode - remove from memory
      if (!isDbConnected || !supabase) {
        const index = mockWorkouts.findIndex(w => w.id === id);
        if (index > -1) {
          mockWorkouts.splice(index, 1);
        }
        return reply.status(204).send();
      }

      // Database mode
      const { error } = await supabase.from('workouts').delete().eq('id', id);

      if (error) {
        return reply.status(400).send({ error: error.message });
      }

      return reply.status(204).send();
    }
  );
}
