import { describe, expect, it } from "vitest";
import { LeadSpreadsheetService } from "../../src/modules/leads/lead-spreadsheet.service.js";

describe("LeadSpreadsheetService", () => {
  const service = new LeadSpreadsheetService();

  it("parses CSV uploads with quoted values", () => {
    const csv = 'name,phone,email,source\n"Acme, Buyer",+15551234567,buyer@example.com,Website';

    expect(
      service.parse({
        fileName: "leads.csv",
        contentBase64: Buffer.from(csv, "utf8").toString("base64"),
      }),
    ).toEqual([
      {
        name: "Acme, Buyer",
        phone: "+15551234567",
        email: "buyer@example.com",
        source: "Website",
      },
    ]);
  });

  it("writes and reads XLSX rows", () => {
    const content = service.serialize("xlsx", [
      ["name", "phone", "email", "source"],
      ["Acme Buyer", "+15551234567", "buyer@example.com", "Website"],
    ]);

    expect(
      service.parse({
        fileName: "leads.xlsx",
        contentBase64: content.toString("base64"),
      }),
    ).toEqual([
      {
        name: "Acme Buyer",
        phone: "+15551234567",
        email: "buyer@example.com",
        source: "Website",
      },
    ]);
  });
});
