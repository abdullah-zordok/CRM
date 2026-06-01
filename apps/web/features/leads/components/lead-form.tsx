"use client";

import { useEffect, useState } from "react";
import { createLead, listLeadSources, type LeadSource } from "../api/leads-client";

const SEEDED_ADMIN_ID = "00000000-0000-4000-8000-000000000001";

export function LeadForm() {
  const [sources, setSources] = useState<LeadSource[]>([]);
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    listLeadSources()
      .then((result) => setSources(result.items))
      .catch(() => setSources([{ code: "MANUAL_ENTRY", name: "Manual Entry", status: "ACTIVE" }]));
  }, []);

  async function submit(formData: FormData) {
    setError(undefined);
    setMessage(undefined);

    try {
      await createLead({
        displayName: String(formData.get("displayName") ?? "").trim() || undefined,
        company: String(formData.get("company") ?? "").trim() || undefined,
        email: String(formData.get("email") ?? "").trim() || undefined,
        phone: String(formData.get("phone") ?? "").trim() || undefined,
        sourceCode: String(formData.get("sourceCode") ?? "MANUAL_ENTRY"),
        priority: "MEDIUM",
        ownerUserId: SEEDED_ADMIN_ID,
        initialNote: String(formData.get("initialNote") ?? "").trim() || undefined,
      });
      setMessage("Lead created.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create lead.");
    }
  }

  return (
    <form className="lead-form" action={submit} aria-label="Create lead">
      <label className="field">
        <span>Name</span>
        <input name="displayName" required />
      </label>
      <label className="field">
        <span>Company</span>
        <input name="company" />
      </label>
      <label className="field">
        <span>Email</span>
        <input name="email" type="email" />
      </label>
      <label className="field">
        <span>Phone</span>
        <input name="phone" />
      </label>
      <label className="field">
        <span>Source</span>
        <select name="sourceCode" defaultValue="MANUAL_ENTRY">
          {sources.map((source) => (
            <option key={source.code} value={source.code}>
              {source.name}
            </option>
          ))}
        </select>
      </label>
      <label className="field lead-form__note">
        <span>Initial note</span>
        <textarea name="initialNote" />
      </label>
      <div className="lead-form__actions">
        <button className="button button--primary" type="submit">
          Create lead
        </button>
        {message ? (
          <p className="status-message" role="status">
            {message}
          </p>
        ) : null}
        {error ? (
          <p className="status-message status-message--error" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </form>
  );
}
