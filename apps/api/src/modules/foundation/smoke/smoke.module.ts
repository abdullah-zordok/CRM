import { Module } from "@nestjs/common";
import { AuthModule } from "../../auth/auth.module.js";
import { SmokeController } from "./smoke.controller.js";
import { SmokeEventService } from "./smoke-event.service.js";
import { SmokeJobProcessor } from "./smoke-job.processor.js";

@Module({
  imports: [AuthModule],
  controllers: [SmokeController],
  providers: [SmokeEventService, SmokeJobProcessor],
})
export class SmokeModule {}
