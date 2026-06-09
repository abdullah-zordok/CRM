"use client";

import { useState } from "react";
import { createActivity, type ActivityOutcome, type ActivityType } from "../api/activities-client";
import { completedActivityFormSchema } from "../validation/activity-validation";

const activityTypes: ActivityType[] = [
  "CALL",
  "EMAIL",
  "MEETING",
  "EXHIBITION_VISIT",
  "WHATSAPP",
  "OTHER",
];
const outcomes: ActivityOutcome[] = [
  "CONNECTED",
  "NO_ANSWER",
  "QUALIFIED_INTEREST",
  "FOLLOW_UP_REQUIRED",
  "NOT_INTERESTED",
  "OTHER",
];

export function CompletedActivityForm({
  leadId,
  ownerUserId,
  onCreated,
}: {
  leadId: string;
  ownerUserId: string;
  onCreated: () => void;
}) {
  const [error, setError] = useState<string>();
  const [message, setMessage] = useState<string>();
  const [loading, setLoading] = useState(false);

  async function submit(formData: FormData) {
    setLoading(true);
    setError(undefined);
    setMessage(undefined);
    const raw = {
      type: String(formData.get("type") ?? "CALL"),
      activityAt: String(formData.get("activityAt") ?? ""),
      outcome: String(formData.get("outcome") ?? "CONNECTED"),
      note: String(formData.get("note") ?? "") || undefined,
    };
    const parsed = completedActivityFormSchema.safeParse(raw);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check the activity details.");
      setLoading(false);
      return;
    }

    try {
      await createActivity({
        leadId,
        ownerUserId,
        type: parsed.data.type,
        activityAt: new Date(parsed.data.activityAt).toISOString(),
        outcome: parsed.data.outcome,
        note: parsed.data.note,
      });
      setMessage("Activity recorded.");
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to record activity.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="activity-form" action={submit} aria-label="Record completed activity">
      <label className="field">
        <span>Activity type</span>
        <select name="type" defaultValue="CALL">
          {activityTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Activity time</span>
        <input name="activityAt" type="datetime-local" required />
      </label>
      <label className="field">
        <span>Outcome</span>
        <select name="outcome" defaultValue="CONNECTED">
          {outcomes.map((outcome) => (
            <option key={outcome} value={outcome}>
              {outcome}
            </option>
          ))}
        </select>
      </label>
      <label className="field activity-form__note">
        <span>Note</span>
        <textarea
          name="note"
          rows={3}
          placeholder="Do not include passwords, payment details, or private credentials."
        />
      </label>
      <div className="activity-form__actions">
        <button className="button button--primary" type="submit" disabled={loading}>
          {loading ? "Recording..." : "Record activity"}
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
