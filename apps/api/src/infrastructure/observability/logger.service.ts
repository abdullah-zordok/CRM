import type { LoggerService as NestLoggerService } from "@nestjs/common";
import { Injectable } from "@nestjs/common";

@Injectable()
export class StructuredLoggerService implements NestLoggerService {
  log(message: string, context?: string): void {
    console.log(JSON.stringify({ level: "info", message, context }));
  }

  error(message: string, trace?: string, context?: string): void {
    console.error(JSON.stringify({ level: "error", message, context, trace }));
  }

  warn(message: string, context?: string): void {
    console.warn(JSON.stringify({ level: "warn", message, context }));
  }

  debug(message: string, context?: string): void {
    if (process.env.LOG_LEVEL === "debug") {
      console.debug(JSON.stringify({ level: "debug", message, context }));
    }
  }
}
