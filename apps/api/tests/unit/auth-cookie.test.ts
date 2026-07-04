import { afterEach, describe, expect, it } from "vitest";
import { sessionCookieOptions } from "../../src/modules/auth/auth.controller.js";

const originalNodeEnv = process.env.NODE_ENV;

afterEach(() => {
  process.env.NODE_ENV = originalNodeEnv;
});

describe("auth session cookie", () => {
  it("allows production cross-origin session fetches", () => {
    process.env.NODE_ENV = "production";

    expect(sessionCookieOptions()).toMatchObject({
      sameSite: "none",
      secure: true,
    });
  });

  it("keeps local cookies simple", () => {
    process.env.NODE_ENV = "development";

    expect(sessionCookieOptions()).toMatchObject({
      sameSite: "lax",
      secure: false,
    });
  });
});
