import { Injectable } from "@nestjs/common";
import { pino } from "pino";

@Injectable()
export class LoggerService {
  private readonly logger = pino({
    level: process.env.NODE_ENV === "test" ? "silent" : "info",
    redact: ["password", "passwordHash", "sessionToken", "token", "authorization"],
  });

  info(message: string, meta: Record<string, unknown> = {}) {
    this.logger.info(meta, message);
  }

  warn(message: string, meta: Record<string, unknown> = {}) {
    this.logger.warn(meta, message);
  }

  error(message: string, meta: Record<string, unknown> = {}) {
    this.logger.error(meta, message);
  }
}
