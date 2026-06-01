import { describe, expect, it } from "vitest";
import { AuthSessionStatus } from "@prisma/client";

describe("auth session lifecycle", () => {
  it("defines login, active session, and logout states", () => {
    expect(Object.values(AuthSessionStatus)).toEqual(
      expect.arrayContaining(["ACTIVE", "REVOKED", "EXPIRED"]),
    );
  });
});
