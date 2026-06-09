import { Module } from "@nestjs/common";
import { RoleGuard } from "../../common/guards/role.guard.js";
import { SessionGuard } from "../../common/guards/session.guard.js";
import { AuthModule } from "../auth/auth.module.js";
import { UsersModule } from "../users/users.module.js";
import { OperationsDashboardController } from "./operations-dashboard.controller.js";
import { OperationsDashboardRepository } from "./operations-dashboard.repository.js";
import { OperationsDashboardService } from "./operations-dashboard.service.js";

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [OperationsDashboardController],
  providers: [
    OperationsDashboardRepository,
    OperationsDashboardService,
    SessionGuard,
    RoleGuard,
  ],
})
export class DashboardsModule {}
