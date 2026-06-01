import type { OnModuleDestroy } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { Redis } from "ioredis";
import { EnvService } from "../../config/env.service.js";

@Injectable()
export class RedisService implements OnModuleDestroy {
  readonly client: Redis;

  constructor(env: EnvService) {
    this.client = new Redis(env.get("REDIS_URL"), {
      lazyConnect: true,
      maxRetriesPerRequest: 2,
    });
  }

  async ping() {
    if (this.client.status === "wait") {
      await this.client.connect();
    }
    return this.client.ping();
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}
