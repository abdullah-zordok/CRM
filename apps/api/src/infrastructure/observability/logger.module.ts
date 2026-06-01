import { Global, Module } from "@nestjs/common";
import { LoggerInterceptor } from "./logger.interceptor.js";
import { StructuredLoggerService } from "./logger.service.js";

@Global()
@Module({
  providers: [StructuredLoggerService, LoggerInterceptor],
  exports: [StructuredLoggerService, LoggerInterceptor],
})
export class LoggerModule {}
