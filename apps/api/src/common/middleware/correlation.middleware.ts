import type { FastifyReply, FastifyRequest } from "fastify";
import { randomUUID } from "node:crypto";

export const correlationHeader = "x-correlation-id";

export function ensureCorrelationId(request: FastifyRequest, reply: FastifyReply) {
  const raw = request.headers[correlationHeader];
  const correlationId = Array.isArray(raw) ? raw[0] : raw;
  const resolved = correlationId && correlationId.length > 0 ? correlationId : randomUUID();
  request.headers[correlationHeader] = resolved;
  reply.header(correlationHeader, resolved);
  return resolved;
}

export function getCorrelationId(request: { headers: Record<string, unknown> }) {
  const raw = request.headers[correlationHeader];
  if (Array.isArray(raw)) return raw[0] ?? randomUUID();
  return typeof raw === "string" ? raw : randomUUID();
}
