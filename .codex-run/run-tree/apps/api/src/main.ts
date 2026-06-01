import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, type NestFastifyApplication } from "@nestjs/platform-fastify";
import cookie from "@fastify/cookie";
import { AppModule } from "./app.module.js";
import { EnvService } from "./config/env.service.js";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter.js";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    bufferLogs: true,
  });
  const env = app.get(EnvService);

  await app.register(cookie, {
    secret: env.get("SESSION_SECRET"),
  });
  app.enableCors({
    origin: env.get("WEB_ORIGIN"),
    credentials: true,
  });
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen({ port: env.getNumber("PORT"), host: "0.0.0.0" });
}

void bootstrap();
