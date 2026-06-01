import type { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import type { Observable } from "rxjs";
import { tap } from "rxjs";
import type { FastifyRequest } from "fastify";
import { getCorrelationId } from "../../common/middleware/correlation.middleware.js";
import { StructuredLoggerService } from "./logger.service.js";

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly logger: StructuredLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const startedAt = Date.now();
    return next.handle().pipe(
      tap(() => {
        this.logger.log(
          "request completed",
          JSON.stringify({
            method: request.method,
            url: request.url,
            correlationId: getCorrelationId(request),
            durationMs: Date.now() - startedAt,
          }),
        );
      }),
    );
  }
}
