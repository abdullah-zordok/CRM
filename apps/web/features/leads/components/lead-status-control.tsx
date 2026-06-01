"use client";

import { useState } from "react";
import { changeLeadStatus, type LeadDetail, type LeadStatus } from "../api/leads-client";

const STATUS_OPTIONS: LeadStatus[] = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "NEGOTIATION",
  "WON",
  "LOST",
  "ARCHIVED",
];

export function LeadStatusControl({ lead }: { lead: LeadDetail }) {
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  async function submit(formData: FormData) {
    setLoading(true);
    setError(undefined);
    setMessage(undefined);
    try {
      const nextStatus = String(formData.get("status") ?? status) as LeadStatus;
      await changeLeadStatus(lead.id, {
        status: nextStatus,
        reason: String(formData.get("reason") ?? reason) || undefined,
        version: lead.version,
      });
      setStatus(nextStatus);
      setMessage("Status updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update status");
    } finally {
      setLoading(false);
    }
  }

  if (!lead.permissions.canChangeStatus) {
    return (
      <section aria-label="Lead status">
        <h2>Status</h2>
        <p>You do not have permission to change this lead status.</p>
      </section>
    );
  }

  return (
    <section aria-label="Lead status">
      <h2>Status</h2>
      <form action={submit}>
        <label>
          Pipeline status
          <select
            name="status"
            value={status}
            onChange={(event) => setStatus(event.target.value as LeadStatus)}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          Reason
          <textarea
            name="reason"
            maxLength={500}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update status"}
        </button>
      </form>
      {error ? <p role="alert">{error}</p> : null}
      {message ? <p>{message}</p> : null}
      <h3>Status history</h3>
      {lead.statusHistory.length === 0 ? <p>No status changes yet.</p> : null}
      <ol>
        {lead.statusHistory.map((entry) => (
          <li key={entry.id}>
            {entry.fromStatus ?? "Initial"} to {entry.toStatus} ({entry.changeType})
          </li>
        ))}
      </ol>
    </section>
  );
}
