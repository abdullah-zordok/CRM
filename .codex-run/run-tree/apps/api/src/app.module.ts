import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EnvModule } from "./config/env.module.js";
import { DatabaseModule } from "./infrastructure/database/database.module.js";
import { CacheModule } from "./infrastructure/cache/cache.module.js";
import { LoggerModule } from "./infrastructure/observability/logger.module.js";
import { HealthModule } from "./modules/foundation/health/health.module.js";
import { AuthModule } from "./modules/auth/auth.module.js";
import { ProtectedShellModule } from "./modules/foundation/protected-shell/protected-shell.module.js";
import { EventsModule } from "./infrastructure/events/events.module.js";
import { QueuesModule } from "./infrastructure/queues/queues.module.js";
import { SmokeModule } from "./modules/foundation/smoke/smoke.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EnvModule,
    LoggerModule,
    DatabaseModule,
    CacheModule,
    EventsModule,
    QueuesModule,
    HealthModule,
    AuthModule,
    ProtectedShellModule,
    SmokeModule,
  ],
})
export class AppModule {}
