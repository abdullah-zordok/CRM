"use client";

import { useState } from "react";
import {
  assignAttendee,
  confirmAttendance,
  type ExhibitionAttendee,
  type ExhibitionDetail,
} from "../api/exhibitions-client";

export function ExhibitionAttendeePanel({
  exhibition,
  onChanged,
}: {
  exhibition: ExhibitionDetail;
  onChanged: () => void;
}) {
  const [error, setError] = useState<string>();
  const [message, setMessage] = useState<string>();

  async function assign(formData: FormData) {
    setError(undefined);
    setMessage(undefined);
    try {
      await assignAttendee(exhibition.id, {
        userId: String(formData.get("userId") ?? "").trim(),
        plannedRole: String(formData.get("plannedRole") ?? "").trim() || undefined,
      });
      setMessage("Attendee assigned.");
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to assign attendee");
    }
  }

  async function confirm(attendee: ExhibitionAttendee) {
    setError(undefined);
    setMessage(undefined);
    try {
      await confirmAttendance(exhibition.id, attendee.id, {
        status: "CONFIRMED",
        version: attendee.version,
      });
      setMessage("Attendance confirmed.");
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to confirm attendance");
    }
  }

  return (
    <section aria-label="Exhibition attendees">
      <h2>Attendees</h2>
      <form action={assign}>
        <label className="field">
          <span>User ID</span>
          <input name="userId" required />
        </label>
        <label className="field">
          <span>Role</span>
          <input name="plannedRole" maxLength={120} />
        </label>
        <button className="button button--secondary" type="submit">
          Assign attendee
        </button>
      </form>
      {message ? <p className="status-message">{message}</p> : null}
      {error ? (
        <p className="status-message status-message--error" role="alert">
          {error}
        </p>
      ) : null}
      {exhibition.attendees.length === 0 ? (
        <p className="empty-state">No attendees assigned.</p>
      ) : null}
      <ul>
        {exhibition.attendees.map((attendee) => (
          <li key={attendee.id}>
            {attendee.displayName} - {attendee.status}
            {attendee.status !== "CONFIRMED" ? (
              <button type="button" onClick={() => confirm(attendee)}>
                Confirm
              </button>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
