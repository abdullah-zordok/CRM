"use client";

import { useState } from "react";
import { createActivity, type ActivityType } from "../api/activities-client";
import { followUpFormSchema } from "../validation/activity-validation";

const activityTypes: ActivityType[] = [
  "CALL",
  "EMAIL",
  "MEETING",
  "EXHIBITION_VISIT",
  "WHATSAPP",
  "OTHER",
];

export function FollowUpForm({
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
    const parsed = followUpFormSchema.safeParse({
      type: String(formData.get("type") ?? "CALL"),
      dueAt: String(formData.get("dueAt") ?? ""),
      note: String(formData.get("note") ?? "") || undefined,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check the follow-up details.");
      setLoading(false);
      return;
    }

    try {
      await createActivity({
        leadId,
        ownerUserId,
        type: parsed.data.type,
        dueAt: new Date(parsed.data.dueAt).toISOString(),
        note: parsed.data.note,
      });
      setMessage("Follow-up scheduled.");
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to schedule follow-up.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="activity-form" action={submit} aria-label="Schedule follow-up">
      <label className="field">
        <span>Follow-up type</span>
        <select name="type" defaultValue="CALL">
          {activityTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Due date</span>
        <input name="dueAt" type="datetime-local" required />
      </label>
      <label className="field activity-form__note">
        <span>Preparation note</span>
        <textarea
          name="note"
          rows={3}
          placeholder="Do not include passwords, payment details, or private credentials."
        />
      </label>
      <div className="activity-form__actions">
        <button className="button button--secondary" type="submit" disabled={loading}>
          {loading ? "Scheduling..." : "Schedule follow-up"}
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
