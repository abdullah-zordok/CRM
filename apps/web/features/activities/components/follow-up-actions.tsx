"use client";

import { useState } from "react";
import {
  reassignActivity,
  type ActivityDetail,
  type ActivityOutcome,
  updateFollowUpStatus,
} from "../api/activities-client";

const outcomes: ActivityOutcome[] = [
  "CONNECTED",
  "NO_ANSWER",
  "QUALIFIED_INTEREST",
  "FOLLOW_UP_REQUIRED",
  "NOT_INTERESTED",
  "OTHER",
];

export function FollowUpActions({
  activity,
  onChanged,
  allowReassign = true,
}: {
  activity: ActivityDetail;
  onChanged: () => void;
  allowReassign?: boolean;
}) {
  const [ownerUserId, setOwnerUserId] = useState(activity.ownerUserId);
  const [error, setError] = useState<string>();
  const [message, setMessage] = useState<string>();

  if (!["OPEN", "DUE_TODAY", "OVERDUE", "IN_PROGRESS"].includes(activity.status)) return null;

  async function start() {
    setError(undefined);
    setMessage(undefined);
    try {
      await updateFollowUpStatus(activity.id, {
        version: activity.version,
        status: "IN_PROGRESS",
      });
      setMessage("Follow-up marked in progress.");
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update follow-up.");
    }
  }

  async function complete(formData: FormData) {
    setError(undefined);
    setMessage(undefined);
    try {
      await updateFollowUpStatus(activity.id, {
        version: activity.version,
        status: "COMPLETED",
        outcome: String(formData.get("outcome") ?? "CONNECTED") as ActivityOutcome,
        completedAt: new Date().toISOString(),
        note: String(formData.get("note") ?? "") || undefined,
      });
      setMessage("Follow-up completed.");
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to complete follow-up.");
    }
  }

  async function reassign(formData: FormData) {
    setError(undefined);
    setMessage(undefined);
    try {
      await reassignActivity(activity.id, {
        version: activity.version,
        ownerUserId: String(formData.get("ownerUserId") ?? ownerUserId),
        reason: String(formData.get("reason") ?? "") || undefined,
      });
      setMessage("Follow-up reassigned.");
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to reassign follow-up.");
    }
  }

  async function cancel(formData: FormData) {
    setError(undefined);
    setMessage(undefined);
    try {
      await updateFollowUpStatus(activity.id, {
        version: activity.version,
        status: "CANCELLED",
        reason: String(formData.get("reason") ?? "") || undefined,
      });
      setMessage("Follow-up canceled.");
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to cancel follow-up.");
    }
  }

  return (
    <div className="follow-up-actions" aria-label={`Actions for ${activity.type} follow-up`}>
      <form action={complete}>
        <label className="field field--compact">
          <span>Outcome</span>
          <select name="outcome" defaultValue="CONNECTED">
            {outcomes.map((outcome) => (
              <option key={outcome} value={outcome}>
                {outcome}
              </option>
            ))}
          </select>
        </label>
        <button className="button button--primary" type="submit">
          Complete
        </button>
      </form>
      {activity.status !== "IN_PROGRESS" ? (
        <button className="button button--secondary" type="button" onClick={start}>
          Start
        </button>
      ) : null}
      {allowReassign ? (
        <form action={reassign}>
          <label className="field field--compact">
            <span>Owner ID</span>
            <input
              name="ownerUserId"
              value={ownerUserId}
              onChange={(event) => setOwnerUserId(event.target.value)}
            />
          </label>
          <button className="button button--secondary" type="submit">
            Reassign
          </button>
        </form>
      ) : null}
      <form action={cancel}>
        <input name="reason" type="hidden" value="No longer needed" />
        <button className="button button--secondary" type="submit">
          Cancel
        </button>
      </form>
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
  );
}
