import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import { supabase, isDbConnected } from '../config/supabase.js';
import { authenticate } from '../middleware/auth.js';

// Mock user storage for when Supabase is not configured
const mockUsers = new Map<string, { id: string; email: string; password: string; name: string }>();

export function registerAuthRoutes(fastify: FastifyInstance) {
  // Register endpoint
  fastify.post('/auth/register', async (request, reply) => {
    const { email, password, name } = request.body as {
      email: string;
      password: string;
      name: string;
    };

    if (!email || !password || !name) {
      return reply.code(400).send({ error: 'Email, password, and name are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return reply.code(400).send({ error: 'Invalid email format' });
    }

    // Validate password strength
    if (password.length < 6) {
      return reply.code(400).send({ error: 'Password must be at least 6 characters long' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      if (isDbConnected && supabase) {
        // Check if user already exists
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('email', email)
          .single();

        if (existingUser) {
          return reply.code(409).send({ error: 'User already exists' });
        }

        // Create user in Supabase
        const { data: user, error } = await supabase
          .from('users')
          .insert([{ email, password: hashedPassword, name }])
          .select()
          .single();

        if (error) {
          fastify.log.error(error);
          return reply.code(500).send({ error: 'Failed to create user' });
        }

        // Generate JWT token
        const token = fastify.jwt.sign({ userId: user.id });

        return reply.send({
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name
          }
        });
      } else {
        // Mock mode
        const userId = `mock-user-${Date.now()}`;

        if (mockUsers.has(email)) {
          return reply.code(409).send({ error: 'User already exists' });
        }

        const mockUser = {
          id: userId,
          email,
          password: hashedPassword,
          name
        };

        mockUsers.set(email, mockUser);

        const token = fastify.jwt.sign({ userId });

        return reply.send({
          token,
          user: {
            id: userId,
            email,
            name
          }
        });
      }
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // Login endpoint
  fastify.post('/auth/login', async (request, reply) => {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };

    if (!email || !password) {
      return reply.code(400).send({ error: 'Email and password are required' });
    }

    try {
      if (isDbConnected && supabase) {
        // Get user from Supabase
        const { data: user, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single();

        if (error || !user) {
          return reply.code(401).send({ error: 'Invalid credentials' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
          return reply.code(401).send({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = fastify.jwt.sign({ userId: user.id });

        return reply.send({
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name
          }
        });
      } else {
        // Mock mode
        const user = mockUsers.get(email);

        if (!user) {
          return reply.code(401).send({ error: 'Invalid credentials' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
          return reply.code(401).send({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = fastify.jwt.sign({ userId: user.id });

        return reply.send({
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name
          }
        });
      }
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // Get current user endpoint (protected)
  fastify.get('/auth/me', { onRequest: [authenticate] }, async (request, reply) => {
    try {
      const userId = request.userId;

      if (!userId) {
        return reply.code(401).send({ error: 'Unauthorized' });
      }

      if (isDbConnected && supabase) {
        const { data: user, error } = await supabase
          .from('users')
          .select('id, email, name')
          .eq('id', userId)
          .single();

        if (error || !user) {
          return reply.code(404).send({ error: 'User not found' });
        }

        return reply.send({ user });
      } else {
        // Mock mode - find user by id
        for (const [email, user] of mockUsers.entries()) {
          if (user.id === userId) {
            return reply.send({
              user: {
                id: user.id,
                email: user.email,
                name: user.name
              }
            });
          }
        }

        return reply.code(404).send({ error: 'User not found' });
      }
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // Logout endpoint (client-side token removal, but provided for completeness)
  fastify.post('/auth/logout', { onRequest: [authenticate] }, async (request, reply) => {
    // In a JWT-based system, logout is typically handled client-side by removing the token
    // This endpoint is here for completeness and could be extended with token blacklisting
    return reply.send({ message: 'Logged out successfully' });
  });
}
