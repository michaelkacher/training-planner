import { FastifyRequest, FastifyReply } from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    userId?: string;
  }
}

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    await request.jwtVerify();
    // The user id is now available in request.user
    request.userId = (request.user as any).userId;
  } catch (err) {
    reply.code(401).send({ error: 'Unauthorized' });
  }
}
