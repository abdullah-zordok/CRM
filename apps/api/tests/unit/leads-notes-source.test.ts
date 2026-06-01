import { describe, expect, it } from "vitest";
import {
  addLeadNoteSchema,
  exhibitionReferenceSchema,
} from "../../src/modules/leads/leads.schemas.js";
import { sanitizeLeadMetadata } from "../../src/modules/leads/leads.dto.js";

describe("lead notes and source rules", () => {
  it("requires append-only note body and current version", () => {
    expect(addLeadNoteSchema.safeParse({ body: "Call completed", version: 1 }).success).toBe(true);
    expect(addLeadNoteSchema.safeParse({ body: "", version: 1 }).success).toBe(false);
  });

  it("validates lightweight exhibition references", () => {
    expect(
      exhibitionReferenceSchema.safeParse({
        name: "City Expo",
        date: "2026-06-01",
        location: "Riyadh",
      }).success,
    ).toBe(true);
  });

  it("sanitizes note metadata", () => {
    expect(sanitizeLeadMetadata({ password: "secret", noteId: "note-1" })).toMatchObject({
      password: "[REDACTED]",
      noteId: "note-1",
    });
  });
});
