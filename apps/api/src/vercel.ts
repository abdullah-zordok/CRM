import type { FastifyInstance } from "fastify";
import type { IncomingMessage, ServerResponse } from "node:http";
import { createApiApp } from "./app.factory.js";

let serverPromise: Promise<FastifyInstance> | undefined;

async function getServer() {
  serverPromise ??= createApiApp().then(async (app) => {
    await app.init();
    const server = app.getHttpAdapter().getInstance();
    await server.ready();
    return server;
  });

  return serverPromise;
}

export async function handleVercelRequest(req: IncomingMessage, res: ServerResponse) {
  const server = await getServer();
  req.url = req.url?.replace(/^\/api(?=\/|$)/, "") || "/";
  server.routing(req, res);
}
