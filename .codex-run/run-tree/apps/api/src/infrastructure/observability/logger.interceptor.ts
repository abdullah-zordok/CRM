import type { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import type { FastifyRequest } from "fastify";
import type { Observable } from "rxjs";
import { tap } from "rxjs";
import { getCorrelationId } from "../../common/middleware/correlation.middleware.js";
import { LoggerService } from "./logger.service.js";

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const startedAt = Date.now();
    const correlationId = getCorrelationId(request);
    return next.handle().pipe(
      tap(() => {
        this.logger.info("request.completed", {
          correlationId,
          method: request.method,
          url: request.url,
          durationMs: Date.now() - startedAt,
        });
      }),
    );
  }
}
