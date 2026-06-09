"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { serializeActivitySearchQuery, type ActivitySearchQuery } from "../api/activities-client";
import { useActivities } from "../hooks/use-activities";
import { ActivityFilterPanel } from "./activity-filter-panel";

function formatWhen(value?: string | null) {
  if (!value) return "Not scheduled";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function followUpStatus(activity: { followUpStatus?: string | null; status: string }) {
  if (activity.followUpStatus) return activity.followUpStatus;
  if (activity.status === "COMPLETED") return "COMPLETED";
  if (activity.status === "CANCELED") return "CANCELLED";
  return "PENDING";
}

export function ActivityWorkspaceList() {
  const [query, setQuery] = useState<ActivitySearchQuery>({});
  const { items, meta, loading, error } = useActivities(query);
  const returnQuery = useMemo(() => serializeActivitySearchQuery(query), [query]);
  const encodedReturnQuery = useMemo(
    () => (returnQuery ? encodeURIComponent(returnQuery) : ""),
    [returnQuery],
  );
  const activities = items.filter((activity) =>
    activity.kind ? activity.kind === "ACTIVITY" : !activity.dueAt,
  );
  const followUps = items.filter((activity) =>
    activity.kind ? activity.kind === "FOLLOW_UP" : Boolean(activity.dueAt),
  );

  return (
    <section className="activity-workspace" aria-labelledby="activities-workspace-title">
      <div className="dashboard-page__header">
        <p className="eyebrow">Team activity review</p>
        <h1 id="activities-workspace-title">Activities</h1>
        <p className="muted-text">
          Review completed lead activities and open follow-ups across your permitted CRM scope.
        </p>
      </div>
      <ActivityFilterPanel query={query} onChange={setQuery} />
      {loading ? <p className="muted-text">Loading activities...</p> : null}
      {error ? (
        <p className="status-message status-message--error" role="alert">
          {error}
        </p>
      ) : null}
      {!loading && !error && items.length === 0 ? (
        <p className="empty-state">No activities match the current filters.</p>
      ) : null}
      {meta ? <p className="muted-text">{meta.total} activity records</p> : null}
      <section className="activity-panel" aria-labelledby="workspace-activities-title">
        <h2 id="workspace-activities-title">Activities</h2>
        {activities.length === 0 ? (
          <p className="empty-state">No completed activities found.</p>
        ) : null}
        <ul className="activity-workspace-list">
          {activities.map((activity) => (
            <li
              className={`activity-item activity-item--${activity.status.toLowerCase()}`}
              key={activity.id}
            >
              <div>
                <strong>{activity.leadDisplayName}</strong>
                <span className="status-pill">{activity.type}</span>
              </div>
              <p>
                Outcome: {activity.outcome ?? "Not recorded"} - Activity Date{" "}
                {formatWhen(activity.activityAt ?? activity.completedAt)}
              </p>
              <p className="muted-text">
                Recorded By:{" "}
                {activity.recordedByDisplayName ?? activity.recordedByUserId ?? "Unknown"} - Lead
                Owner: {activity.ownerDisplayName ?? activity.ownerUserId}
              </p>
              {activity.notePreview ? <p className="muted-text">{activity.notePreview}</p> : null}
              <Link
                className="button button--secondary"
                href={`/leads/${activity.leadId}${
                  encodedReturnQuery ? `?fromActivities=${encodedReturnQuery}` : ""
                }`}
              >
                Open lead
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section className="activity-panel" aria-labelledby="workspace-follow-ups-title">
        <h2 id="workspace-follow-ups-title">Follow-ups</h2>
        {followUps.length === 0 ? <p className="empty-state">No follow-ups found.</p> : null}
        <ul className="activity-workspace-list">
          {followUps.map((activity) => (
            <li
              className={`activity-item activity-item--${activity.status.toLowerCase()}`}
              key={activity.id}
            >
              <div>
                <strong>{activity.type} FOLLOW-UP</strong>
                <span className="status-pill">{followUpStatus(activity)}</span>
              </div>
              <p>Due Date: {formatWhen(activity.dueAt)}</p>
              <p className="muted-text">
                Assigned To: {activity.ownerDisplayName ?? activity.ownerUserId} - Created By:{" "}
                {activity.recordedByDisplayName ?? activity.recordedByUserId ?? "Unknown"}
              </p>
              {activity.notePreview ? <p className="muted-text">{activity.notePreview}</p> : null}
              <Link
                className="button button--secondary"
                href={`/leads/${activity.leadId}${
                  encodedReturnQuery ? `?fromActivities=${encodedReturnQuery}` : ""
                }`}
              >
                Open lead
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
