"use client";

import { useEffect, useState } from "react";
import { listLeadActivities, type ActivityDetail } from "../api/activities-client";
import { CompletedActivityForm } from "./completed-activity-form";
import { FollowUpActions } from "./follow-up-actions";
import { FollowUpForm } from "./follow-up-form";

function formatWhen(value?: string | null) {
  if (!value) return "Not scheduled";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function followUpStatus(activity: ActivityDetail) {
  if (activity.followUpStatus) return activity.followUpStatus;
  if (activity.status === "COMPLETED") return "COMPLETED";
  if (activity.status === "CANCELED") return "CANCELLED";
  return "PENDING";
}

function compareDateDesc(left?: string | null, right?: string | null) {
  return new Date(right ?? 0).getTime() - new Date(left ?? 0).getTime();
}

function compareDateAsc(left?: string | null, right?: string | null) {
  const leftTime = left ? new Date(left).getTime() : Number.MAX_SAFE_INTEGER;
  const rightTime = right ? new Date(right).getTime() : Number.MAX_SAFE_INTEGER;
  return leftTime - rightTime;
}

function isOverdueFollowUp(activity: ActivityDetail) {
  return followUpStatus(activity) === "OVERDUE";
}

export function LeadActivityTimeline({
  leadId,
  ownerUserId,
  allowFollowUpReassign = true,
}: {
  leadId: string;
  ownerUserId: string;
  allowFollowUpReassign?: boolean;
}) {
  const [items, setItems] = useState<ActivityDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  function load() {
    setLoading(true);
    setError(undefined);
    listLeadActivities(leadId)
      .then((result) => setItems(result.items))
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Unable to load activities."),
      )
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, [leadId]);

  const activities = items.filter((activity) =>
    activity.kind ? activity.kind === "ACTIVITY" : !activity.dueAt,
  );
  const followUps = items.filter((activity) =>
    activity.kind ? activity.kind === "FOLLOW_UP" : Boolean(activity.dueAt),
  );
  const sortedActivities = [...activities].sort((left, right) =>
    compareDateDesc(left.activityAt ?? left.completedAt, right.activityAt ?? right.completedAt),
  );
  const sortedFollowUps = [...followUps].sort((left, right) =>
    compareDateAsc(left.dueAt, right.dueAt),
  );

  return (
    <>
      <section className="activity-panel" aria-labelledby="activities-title">
        <div className="activity-panel__header">
          <div>
            <p className="eyebrow">Completed actions</p>
            <h2 id="activities-title">Activities</h2>
          </div>
        </div>
        <CompletedActivityForm leadId={leadId} ownerUserId={ownerUserId} onCreated={load} />
        {loading ? <p className="muted-text">Loading activities...</p> : null}
        {error ? (
          <p className="status-message status-message--error" role="alert">
            {error}
          </p>
        ) : null}
        {!loading && !error && activities.length === 0 ? (
          <p className="empty-state">No activities recorded yet.</p>
        ) : null}
        {sortedActivities.length > 0 ? (
          <div className="activity-table-wrap">
            <table className="activity-table">
              <thead>
                <tr>
                  <th scope="col">Activity Type</th>
                  <th scope="col">Outcome</th>
                  <th scope="col">Recorded By</th>
                  <th scope="col">Lead Owner</th>
                  <th scope="col">Activity Date</th>
                  <th scope="col">Notes</th>
                  <th scope="col">Created At</th>
                </tr>
              </thead>
              <tbody>
                {sortedActivities.map((activity) => (
                  <tr key={activity.id}>
                    <td>
                      <span className="status-pill">{activity.type}</span>
                    </td>
                    <td>{activity.outcome ?? "Not recorded"}</td>
                    <td>{activity.recordedByDisplayName ?? activity.recordedByUserId ?? "Unknown"}</td>
                    <td>{activity.ownerDisplayName ?? activity.ownerUserId}</td>
                    <td>{formatWhen(activity.activityAt ?? activity.completedAt)}</td>
                    <td className="activity-table__notes">{activity.note ?? "No notes"}</td>
                    <td>{formatWhen(activity.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>

      <section className="activity-panel" aria-labelledby="follow-ups-title">
        <div className="activity-panel__header">
          <div>
            <p className="eyebrow">Planned next actions</p>
            <h2 id="follow-ups-title">Follow-ups</h2>
          </div>
        </div>
        <FollowUpForm leadId={leadId} ownerUserId={ownerUserId} onCreated={load} />
        {loading ? <p className="muted-text">Loading follow-ups...</p> : null}
        {error ? (
          <p className="status-message status-message--error" role="alert">
            {error}
          </p>
        ) : null}
        {!loading && !error && followUps.length === 0 ? (
          <p className="empty-state">No follow-ups scheduled yet.</p>
        ) : null}
        {sortedFollowUps.length > 0 ? (
          <div className="activity-table-wrap">
            <table className="activity-table activity-table--follow-ups">
              <thead>
                <tr>
                  <th scope="col">Follow-Up Type</th>
                  <th scope="col">Assigned To</th>
                  <th scope="col">Created By</th>
                  <th scope="col">Due Date</th>
                  <th scope="col">Status</th>
                  <th scope="col">Preparation Notes</th>
                  <th scope="col">Created At</th>
                </tr>
              </thead>
              <tbody>
                {sortedFollowUps.map((activity) => {
                  const status = followUpStatus(activity);
                  return (
                    <tr
                      className={isOverdueFollowUp(activity) ? "activity-table__row--overdue" : ""}
                      key={activity.id}
                    >
                      <td>
                        <span className="status-pill">{activity.type}</span>
                      </td>
                      <td>{activity.ownerDisplayName ?? activity.ownerUserId}</td>
                      <td>
                        {activity.recordedByDisplayName ?? activity.recordedByUserId ?? "Unknown"}
                      </td>
                      <td>{formatWhen(activity.dueAt)}</td>
                      <td>
                        <div className="activity-table__status-cell">
                          <span
                            className={`activity-status-badge activity-status-badge--${status.toLowerCase()}`}
                          >
                            {status}
                          </span>
                          <FollowUpActions
                            activity={activity}
                            onChanged={load}
                            allowReassign={allowFollowUpReassign}
                          />
                        </div>
                      </td>
                      <td className="activity-table__notes">{activity.note ?? "No preparation notes"}</td>
                      <td>{formatWhen(activity.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </>
  );
}
