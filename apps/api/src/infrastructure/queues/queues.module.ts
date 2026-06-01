import { Global, Module } from "@nestjs/common";
import { FoundationSmokeQueue } from "./foundation-smoke.queue.js";
import { JobStatusRepository } from "./job-status.repository.js";

@Global()
@Module({
  providers: [FoundationSmokeQueue, JobStatusRepository],
  exports: [FoundationSmokeQueue, JobStatusRepository],
})
export class QueuesModule {}
