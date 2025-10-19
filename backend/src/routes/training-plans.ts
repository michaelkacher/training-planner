import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { supabase, isDbConnected } from '../config/supabase.js';
import type { TrainingPlan, CreateTrainingPlanDTO } from '../types/index.js';

// In-memory storage for mock mode
let mockTrainingPlans: TrainingPlan[] = [];

interface CreateTrainingPlanRequest {
  Body: CreateTrainingPlanDTO & {
    athlete_id: string;
    template_id?: string;
  };
}

interface UpdateTrainingPlanRequest {
  Params: { id: string };
  Body: Partial<CreateTrainingPlanDTO>;
}

interface GetTrainingPlansRequest {
  Querystring: { athlete_id?: string; is_active?: string };
}

interface ActivateTrainingPlanRequest {
  Params: { id: string };
}

export function registerTrainingPlanRoutes(fastify: FastifyInstance) {
  // Get all training plans (optionally filtered by athlete_id or is_active)
  fastify.get<GetTrainingPlansRequest>(
    '/training-plans',
    async (request: FastifyRequest<GetTrainingPlansRequest>, reply: FastifyReply) => {
      const { athlete_id, is_active } = request.query;

      // Mock mode - return in-memory data
      if (!isDbConnected || !supabase) {
        let filtered = mockTrainingPlans;
        if (athlete_id) {
          filtered = filtered.filter(p => p.athlete_id === athlete_id);
        }
        if (is_active !== undefined) {
          const activeFilter = is_active === 'true';
          filtered = filtered.filter(p => p.is_active === activeFilter);
        }
        return reply.send(filtered);
      }

      // Database mode
      let query = supabase.from('training_plans').select('*');

      if (athlete_id) {
        query = query.eq('athlete_id', athlete_id);
      }
      if (is_active !== undefined) {
        const activeFilter = is_active === 'true';
        query = query.eq('is_active', activeFilter);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        return reply.status(500).send({ error: error.message });
      }

      return reply.send(data);
    }
  );

  // Get single training plan by ID
  fastify.get<{ Params: { id: string } }>(
    '/training-plans/:id',
    async (request, reply) => {
      const { id } = request.params;

      // Mock mode
      if (!isDbConnected || !supabase) {
        const plan = mockTrainingPlans.find(p => p.id === id);
        if (!plan) {
          return reply.status(404).send({ error: 'Training plan not found' });
        }
        return reply.send(plan);
      }

      // Database mode
      const { data, error } = await supabase
        .from('training_plans')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return reply.status(404).send({ error: 'Training plan not found' });
      }

      return reply.send(data);
    }
  );

  // Create new training plan
  fastify.post<CreateTrainingPlanRequest>(
    '/training-plans',
    async (request: FastifyRequest<CreateTrainingPlanRequest>, reply: FastifyReply) => {
      const { athlete_id, template_id, ...planData } = request.body;

      // Validate required fields
      if (!athlete_id) {
        return reply.status(400).send({ error: 'athlete_id is required' });
      }

      // Mock mode - store in memory
      if (!isDbConnected || !supabase) {
        const newPlan: TrainingPlan = {
          id: `mock-${Date.now()}`,
          athlete_id,
          ...planData,
          is_active: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        mockTrainingPlans.unshift(newPlan);
        return reply.status(201).send(newPlan);
      }

      // Database mode
      const { data, error } = await supabase
        .from('training_plans')
        .insert([{ athlete_id, ...planData, is_active: false }])
        .select()
        .single();

      if (error) {
        return reply.status(400).send({ error: error.message });
      }

      return reply.status(201).send(data);
    }
  );

  // Update training plan
  fastify.put<UpdateTrainingPlanRequest>(
    '/training-plans/:id',
    async (request: FastifyRequest<UpdateTrainingPlanRequest>, reply: FastifyReply) => {
      const { id } = request.params;
      const updates = request.body;

      // Mock mode
      if (!isDbConnected || !supabase) {
        const index = mockTrainingPlans.findIndex(p => p.id === id);
        if (index === -1) {
          return reply.status(404).send({ error: 'Training plan not found' });
        }
        mockTrainingPlans[index] = {
          ...mockTrainingPlans[index],
          ...updates,
          updated_at: new Date().toISOString()
        };
        return reply.send(mockTrainingPlans[index]);
      }

      // Database mode
      const { data, error } = await supabase
        .from('training_plans')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return reply.status(400).send({ error: error.message });
      }

      return reply.send(data);
    }
  );

  // Activate a training plan (deactivates other plans for the athlete)
  fastify.post<ActivateTrainingPlanRequest>(
    '/training-plans/:id/activate',
    async (request: FastifyRequest<ActivateTrainingPlanRequest>, reply: FastifyReply) => {
      const { id } = request.params;

      // Mock mode
      if (!isDbConnected || !supabase) {
        const plan = mockTrainingPlans.find(p => p.id === id);
        if (!plan) {
          return reply.status(404).send({ error: 'Training plan not found' });
        }

        // Deactivate all other plans for this athlete
        mockTrainingPlans.forEach(p => {
          if (p.athlete_id === plan.athlete_id) {
            p.is_active = false;
          }
        });

        // Activate this plan
        plan.is_active = true;
        plan.updated_at = new Date().toISOString();

        return reply.send(plan);
      }

      // Database mode
      // First, get the plan to find the athlete_id
      const { data: plan, error: getPlanError } = await supabase
        .from('training_plans')
        .select('*')
        .eq('id', id)
        .single();

      if (getPlanError || !plan) {
        return reply.status(404).send({ error: 'Training plan not found' });
      }

      // Deactivate all other plans for this athlete
      const { error: deactivateError } = await supabase
        .from('training_plans')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('athlete_id', plan.athlete_id)
        .neq('id', id);

      if (deactivateError) {
        return reply.status(500).send({ error: 'Failed to deactivate other plans' });
      }

      // Activate this plan
      const { data: activatedPlan, error: activateError } = await supabase
        .from('training_plans')
        .update({ is_active: true, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (activateError) {
        return reply.status(400).send({ error: activateError.message });
      }

      return reply.send(activatedPlan);
    }
  );

  // Delete training plan
  fastify.delete<{ Params: { id: string } }>(
    '/training-plans/:id',
    async (request, reply) => {
      const { id } = request.params;

      // Mock mode - remove from memory
      if (!isDbConnected || !supabase) {
        const index = mockTrainingPlans.findIndex(p => p.id === id);
        if (index > -1) {
          mockTrainingPlans.splice(index, 1);
        }
        return reply.status(204).send();
      }

      // Database mode
      const { error } = await supabase.from('training_plans').delete().eq('id', id);

      if (error) {
        return reply.status(400).send({ error: error.message });
      }

      return reply.status(204).send();
    }
  );
}
