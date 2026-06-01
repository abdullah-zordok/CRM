import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ZodValidationPipe } from "../../common/validation/zod-validation.pipe.js";
import { getCorrelationId } from "../../common/middleware/correlation.middleware.js";
import { SessionGuard, type AuthenticatedRequest } from "../../common/guards/session.guard.js";
import { AuthService } from "./auth.service.js";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(12).max(128),
});

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("login")
  async login(
    @Body(new ZodValidationPipe(loginSchema)) body: z.infer<typeof loginSchema>,
    @Req() request: FastifyRequest,
    @Res({ passthrough: true }) reply: FastifyReply,
  ) {
    const result = await this.auth.login(body.email, body.password, getCorrelationId(request));
    reply.setCookie("crm_session", result.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    reply.status(204);
  }

  @Post("logout")
  @UseGuards(SessionGuard)
  async logout(@Req() request: FastifyRequest, @Res({ passthrough: true }) reply: FastifyReply) {
    const token = request.cookies?.crm_session;
    if (token) {
      await this.auth.logout(token, getCorrelationId(request));
    }
    reply.clearCookie("crm_session", { path: "/" });
    reply.status(204);
  }

  @Get("me")
  @UseGuards(SessionGuard)
  me(@Req() request: AuthenticatedRequest) {
    return {
      id: request.user?.id,
      email: request.user?.email,
      displayName: "Seeded Admin",
      roles: request.user?.roles ?? [],
      correlationId: getCorrelationId(request),
    };
  }
}
