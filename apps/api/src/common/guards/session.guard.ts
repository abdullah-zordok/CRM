import type { CanActivate, ExecutionContext } from "@nestjs/common";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import type { FastifyRequest } from "fastify";
import { AuthService } from "../../modules/auth/auth.service.js";

export type AuthenticatedRequest = FastifyRequest & {
  user?: {
    id: string;
    email: string;
    displayName: string;
    status: string;
    roles: string[];
    hasReviewerAccess: boolean;
    sessionId: string;
    activeTeam?: { id: string; name: string; status: string };
  };
};

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = request.cookies?.crm_session;
    if (!token) {
      throw new UnauthorizedException("Authentication required");
    }

    request.user = await this.auth.validateSession(token);
    return true;
  }
}
