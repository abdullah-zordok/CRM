import type { OnModuleDestroy } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { Redis } from "ioredis";
import { EnvService } from "../../config/env.service.js";

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly redisUrl: string;
  private readonly client: Redis;

  constructor(env: EnvService) {
    this.redisUrl = env.get("REDIS_URL");
    this.client = new Redis(this.redisUrl, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
    });
  }

  async ping(): Promise<string> {
    if (this.client.status === "wait") {
      await this.client.connect();
    }
    return this.client.ping();
  }

  get connection(): Redis {
    return this.client;
  }

  createQueueConnection(): Redis {
    return new Redis(this.redisUrl, {
      lazyConnect: true,
      maxRetriesPerRequest: null,
    });
  }

  async onModuleDestroy(): Promise<void> {
    this.client.disconnect();
  }
}
