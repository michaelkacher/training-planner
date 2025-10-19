import { FastifyInstance } from 'fastify';
import { supabase, isDbConnected } from '../config/supabase.js';
import type { WorkoutSession, CreateWorkoutSessionDTO, UpdateWorkoutSessionDTO } from '../types/index.js';
import { mockSessions } from '../shared/mock-data.js';

export function registerWorkoutSessionRoutes(fastify: FastifyInstance) {
  // Get workout sessions for a date range
  fastify.get('/workout-sessions', async (request, reply) => {
    const { athlete_id, start_date, end_date, training_plan_id } = request.query as {
      athlete_id: string;
      start_date?: string;
      end_date?: string;
      training_plan_id?: string;
    };

    if (!athlete_id) {
      return reply.code(400).send({ error: 'athlete_id is required' });
    }

    try {
      if (isDbConnected && supabase) {
        let query = supabase
          .from('workout_sessions')
          .select('*, workout:workouts(*)')
          .eq('athlete_id', athlete_id);

        if (start_date) {
          query = query.gte('scheduled_date', start_date);
        }
        if (end_date) {
          query = query.lte('scheduled_date', end_date);
        }
        if (training_plan_id) {
          query = query.eq('training_plan_id', training_plan_id);
        }

        const { data, error } = await query.order('scheduled_date', { ascending: true });

        if (error) {
          fastify.log.error(error);
          return reply.code(500).send({ error: 'Failed to fetch workout sessions' });
        }

        return reply.send(data || []);
      } else {
        // Mock mode
        const sessions = Array.from(mockSessions.values()).filter(session => {
          if (session.athlete_id !== athlete_id) return false;
          if (training_plan_id && session.training_plan_id !== training_plan_id) return false;
          if (start_date && session.scheduled_date < start_date) return false;
          if (end_date && session.scheduled_date > end_date) return false;
          return true;
        });

        return reply.send(sessions.sort((a, b) =>
          a.scheduled_date.localeCompare(b.scheduled_date)
        ));
      }
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // Create a new workout session
  fastify.post('/workout-sessions', async (request, reply) => {
    const { athlete_id, ...sessionData } = request.body as CreateWorkoutSessionDTO & { athlete_id: string };

    if (!athlete_id) {
      return reply.code(400).send({ error: 'athlete_id is required' });
    }

    try {
      if (isDbConnected && supabase) {
        const { data, error } = await supabase
          .from('workout_sessions')
          .insert([
            {
              athlete_id,
              ...sessionData,
              status: 'scheduled'
            }
          ])
          .select()
          .single();

        if (error) {
          fastify.log.error(error);
          return reply.code(500).send({ error: 'Failed to create workout session' });
        }

        return reply.send(data);
      } else {
        // Mock mode
        const session: WorkoutSession = {
          id: `mock-session-${Date.now()}`,
          athlete_id,
          ...sessionData,
          status: 'scheduled',
          notes: undefined,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        mockSessions.set(session.id, session);
        return reply.send(session);
      }
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // Update a workout session
  fastify.put('/workout-sessions/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const updateData = request.body as UpdateWorkoutSessionDTO;

    try {
      if (isDbConnected && supabase) {
        const { data, error } = await supabase
          .from('workout_sessions')
          .update({
            ...updateData,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single();

        if (error) {
          fastify.log.error(error);
          return reply.code(500).send({ error: 'Failed to update workout session' });
        }

        return reply.send(data);
      } else {
        // Mock mode
        const session = mockSessions.get(id);

        if (!session) {
          return reply.code(404).send({ error: 'Session not found' });
        }

        const updatedSession = {
          ...session,
          ...updateData,
          updated_at: new Date().toISOString()
        };

        mockSessions.set(id, updatedSession);
        return reply.send(updatedSession);
      }
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // Delete a workout session
  fastify.delete('/workout-sessions/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      if (isDbConnected && supabase) {
        const { error } = await supabase
          .from('workout_sessions')
          .delete()
          .eq('id', id);

        if (error) {
          fastify.log.error(error);
          return reply.code(500).send({ error: 'Failed to delete workout session' });
        }

        return reply.send({ message: 'Session deleted successfully' });
      } else {
        // Mock mode
        if (!mockSessions.has(id)) {
          return reply.code(404).send({ error: 'Session not found' });
        }

        mockSessions.delete(id);
        return reply.send({ message: 'Session deleted successfully' });
      }
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });
}
