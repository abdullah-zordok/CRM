import { Global, Module } from "@nestjs/common";
import { EnvModule } from "../../config/env.module.js";
import { RedisService } from "./redis.service.js";

@Global()
@Module({
  imports: [EnvModule],
  providers: [RedisService],
  exports: [RedisService],
})
export class CacheModule {}
