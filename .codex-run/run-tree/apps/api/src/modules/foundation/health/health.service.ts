import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { PrismaService } from "../../../infrastructure/database/prisma.service.js";
import { RedisService } from "../../../infrastructure/cache/redis.service.js";

type ServiceStatus = {
  name: "api" | "database" | "cache" | "queue";
  status: "UP" | "DEGRADED" | "DOWN";
  message?: string;
};

@Injectable()
export class HealthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  live() {
    return {
      status: "UP" as const,
      checkedAt: new Date().toISOString(),
      correlationId: randomUUID(),
    };
  }

  async ready() {
    const services: ServiceStatus[] = [{ name: "api", status: "UP" }];
    services.push(await this.databaseStatus());
    services.push(await this.cacheStatus());
    services.push({
      name: "queue",
      status: services.some((service) => service.name === "cache" && service.status === "UP")
        ? "UP"
        : "DOWN",
    });

    return {
      status: services.every((service) => service.status === "UP") ? "UP" : "DOWN",
      checkedAt: new Date().toISOString(),
      correlationId: randomUUID(),
      services,
    };
  }

  private async databaseStatus(): Promise<ServiceStatus> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { name: "database", status: "UP" };
    } catch {
      return { name: "database", status: "DOWN", message: "Database unavailable" };
    }
  }

  private async cacheStatus(): Promise<ServiceStatus> {
    try {
      await this.redis.ping();
      return { name: "cache", status: "UP" };
    } catch {
      return { name: "cache", status: "DOWN", message: "Cache unavailable" };
    }
  }
}
