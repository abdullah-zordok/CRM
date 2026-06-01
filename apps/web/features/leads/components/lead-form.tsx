"use client";

import { useEffect, useState } from "react";
import { createLead, listLeadSources, type LeadSource } from "../api/leads-client";

const SEEDED_ADMIN_ID = "00000000-0000-4000-8000-000000000001";

export function LeadForm() {
  const [sources, setSources] = useState<LeadSource[]>([]);
  const [message, setMessage] = useState<string>();

  useEffect(() => {
    listLeadSources()
      .then((result) => setSources(result.items))
      .catch(() => setSources([{ code: "MANUAL_ENTRY", name: "Manual Entry", status: "ACTIVE" }]));
  }, []);

  async function submit(formData: FormData) {
    await createLead({
      displayName: String(formData.get("displayName") ?? ""),
      company: String(formData.get("company") ?? "") || undefined,
      email: String(formData.get("email") ?? "") || undefined,
      phone: String(formData.get("phone") ?? "") || undefined,
      sourceCode: String(formData.get("sourceCode") ?? "MANUAL_ENTRY"),
      priority: "MEDIUM",
      ownerUserId: SEEDED_ADMIN_ID,
      initialNote: String(formData.get("initialNote") ?? "") || undefined,
    });
    setMessage("Lead created.");
  }

  return (
    <form action={submit}>
      <label>
        Name
        <input name="displayName" required />
      </label>
      <label>
        Company
        <input name="company" />
      </label>
      <label>
        Email
        <input name="email" type="email" />
      </label>
      <label>
        Phone
        <input name="phone" />
      </label>
      <label>
        Source
        <select name="sourceCode" defaultValue="MANUAL_ENTRY">
          {sources.map((source) => (
            <option key={source.code} value={source.code}>
              {source.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Initial note
        <textarea name="initialNote" />
      </label>
      <button type="submit">Create lead</button>
      {message ? <p>{message}</p> : null}
    </form>
  );
}
