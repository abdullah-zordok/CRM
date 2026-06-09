"use client";

import { useState } from "react";
import { createExhibition, type ExhibitionStatus } from "../api/exhibitions-client";

const SEEDED_ADMIN_ID = "00000000-0000-4000-8000-000000000001";
const STATUS_OPTIONS: ExhibitionStatus[] = ["PLANNED", "ACTIVE", "COMPLETED", "CANCELED"];

function toIsoDateTime(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();
  return raw ? new Date(raw).toISOString() : "";
}

export function ExhibitionForm({ onCreated }: { onCreated?: () => void }) {
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  async function submit(formData: FormData) {
    setLoading(true);
    setMessage(undefined);
    setError(undefined);
    try {
      await createExhibition({
        name: String(formData.get("name") ?? "").trim(),
        startsAt: toIsoDateTime(formData.get("startsAt")),
        endsAt: toIsoDateTime(formData.get("endsAt")),
        location: String(formData.get("location") ?? "").trim(),
        status: String(formData.get("status") ?? "PLANNED") as ExhibitionStatus,
        ownerUserId: String(formData.get("ownerUserId") ?? SEEDED_ADMIN_ID).trim(),
        teamId: String(formData.get("teamId") ?? "").trim() || undefined,
        notes: String(formData.get("notes") ?? "").trim() || undefined,
      });
      setMessage("Exhibition created.");
      onCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create exhibition.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="lead-form" action={submit} aria-label="Create exhibition">
      <label className="field">
        <span>Name</span>
        <input name="name" required maxLength={160} />
      </label>
      <label className="field">
        <span>Starts</span>
        <input name="startsAt" type="datetime-local" required />
      </label>
      <label className="field">
        <span>Ends</span>
        <input name="endsAt" type="datetime-local" required />
      </label>
      <label className="field">
        <span>Location</span>
        <input name="location" required maxLength={160} />
      </label>
      <label className="field">
        <span>Status</span>
        <select name="status" defaultValue="PLANNED">
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Owner</span>
        <input name="ownerUserId" defaultValue={SEEDED_ADMIN_ID} required />
      </label>
      <label className="field">
        <span>Team</span>
        <input name="teamId" />
      </label>
      <label className="field lead-form__note">
        <span>Notes</span>
        <textarea name="notes" maxLength={4000} />
      </label>
      <div className="lead-form__actions">
        <button className="button button--primary" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create exhibition"}
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
