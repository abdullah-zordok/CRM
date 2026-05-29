import { Injectable } from "@nestjs/common";
import { envSchema, type Env } from "./env.schema.js";

@Injectable()
export class EnvService {
  private readonly env: Env;

  constructor() {
    const parsed = envSchema.safeParse(process.env);
    if (!parsed.success) {
      const details = parsed.error.issues.map((issue) => issue.path.join(".")).join(", ");
      throw new Error(`Invalid environment configuration: ${details}`);
    }
    this.env = parsed.data;
  }

  get<K extends keyof Env>(key: K): Env[K] {
    return this.env[key];
  }

  getNumber(key: keyof Env): number {
    const value = this.env[key];
    if (typeof value !== "number") {
      throw new Error(`Environment value ${String(key)} is not a number`);
    }
    return value;
  }
}
