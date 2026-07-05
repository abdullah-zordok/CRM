import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { getCorrelationId } from "../../common/middleware/correlation.middleware.js";
import { ZodValidationPipe } from "../../common/validation/zod-validation.pipe.js";
import { SessionGuard, type AuthenticatedRequest } from "../../common/guards/session.guard.js";
import { AuthService } from "./auth.service.js";

const loginSchema = z.object({
  email: z
    .string()
    .email()
    .max(320)
    .transform((email) => email.toLowerCase()),
  password: z.string().min(12).max(128),
});

type LoginInput = z.infer<typeof loginSchema>;

export function sessionCookieOptions() {
  const production = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    sameSite: production ? ("none" as const) : ("lax" as const),
    secure: production,
    path: "/",
    maxAge: 60 * 60 * 8,
  };
}

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("login")
  @UsePipes(new ZodValidationPipe(loginSchema))
  async login(
    @Body() body: LoginInput,
    @Req() request: FastifyRequest,
    @Res() reply: FastifyReply,
  ) {
    const session = await this.auth.login(body.email, body.password, getCorrelationId(request));
    reply.setCookie("crm_session", session.token, sessionCookieOptions()).status(204).send();
  }

  @Post("logout")
  @UseGuards(SessionGuard)
  async logout(@Req() request: FastifyRequest, @Res() reply: FastifyReply) {
    const token = request.cookies?.crm_session;
    if (!token) {
      throw new UnauthorizedException("Authentication required");
    }
    await this.auth.logout(token, getCorrelationId(request));
    reply.clearCookie("crm_session", sessionCookieOptions()).status(204).send();
  }

  @Get("me")
  @UseGuards(SessionGuard)
  me(@Req() request: AuthenticatedRequest) {
    return {
      id: request.user?.id,
      email: request.user?.email,
      displayName: request.user?.displayName,
      roles: request.user?.roles ?? [],
      hasReviewerAccess: request.user?.hasReviewerAccess ?? false,
      correlationId: getCorrelationId(request),
    };
  }
}
