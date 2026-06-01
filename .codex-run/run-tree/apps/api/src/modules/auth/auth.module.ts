import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller.js";
import { AuthRepository } from "./auth.repository.js";
import { AuthService } from "./auth.service.js";
import { SecurityAuditRepository } from "./audit/security-audit.repository.js";
import { SecurityAuditService } from "./audit/security-audit.service.js";
import { PasswordService } from "./security/password.service.js";
import { SessionTokenService } from "./security/session-token.service.js";

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    PasswordService,
    SessionTokenService,
    SecurityAuditRepository,
    SecurityAuditService,
  ],
  exports: [AuthService, SecurityAuditService],
})
export class AuthModule {}
