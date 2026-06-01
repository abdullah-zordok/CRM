import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, type NestFastifyApplication } from "@nestjs/platform-fastify";
import cookie from "@fastify/cookie";
import { AppModule } from "./app.module.js";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    bufferLogs: true,
  });

  await app.register(cookie, {
    secret: process.env.SESSION_SECRET || "replace-with-local-session-secret",
  });

  app.enableCors({
    origin: process.env.WEB_ORIGIN || "http://localhost:3000",
    credentials: true,
  });

  const port = parseInt(process.env.PORT || "3001", 10);
  await app.listen({ port, host: "0.0.0.0" });
  console.log(`Application is running on: http://localhost:${port}`);
}

void bootstrap();
