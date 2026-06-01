import { Module } from "@nestjs/common";
import { AuthModule } from "../../auth/auth.module.js";
import { ProtectedShellController } from "./protected-shell.controller.js";

@Module({
  imports: [AuthModule],
  controllers: [ProtectedShellController],
})
export class ProtectedShellModule {}
