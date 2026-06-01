import { Module } from "@nestjs/common";
import { SessionGuard } from "../../common/guards/session.guard.js";
import { AuthController } from "./auth.controller.js";
import { AuthRepository } from "./auth.repository.js";
import { AuthService } from "./auth.service.js";
import { SecurityAuditService } from "./audit/security-audit.service.js";
import { PasswordService } from "./security/password.service.js";
import { SessionTokenService } from "./security/session-token.service.js";

@Module({
  controllers: [AuthController],
  providers: [
    AuthRepository,
    AuthService,
    PasswordService,
    SessionTokenService,
    SecurityAuditService,
    SessionGuard,
  ],
  exports: [AuthService, PasswordService, SessionTokenService, SecurityAuditService, SessionGuard],
})
export class AuthModule {}
