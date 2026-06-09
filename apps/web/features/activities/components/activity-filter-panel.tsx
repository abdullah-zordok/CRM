"use client";

import type { FormEvent } from "react";
import { type ActivitySearchQuery, type ActivityType } from "../api/activities-client";

const activityTypes: Array<"" | ActivityType> = [
  "",
  "CALL",
  "EMAIL",
  "MEETING",
  "EXHIBITION_VISIT",
  "WHATSAPP",
  "OTHER",
];
const dueStates = ["", "OPEN", "DUE_TODAY", "OVERDUE", "COMPLETED", "CANCELED"] as const;

export function ActivityFilterPanel({
  query,
  onChange,
}: {
  query: ActivitySearchQuery;
  onChange: (query: ActivitySearchQuery) => void;
}) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onChange({
      ownerUserId: String(form.get("ownerUserId") ?? "") || undefined,
      teamId: String(form.get("teamId") ?? "") || undefined,
      leadId: String(form.get("leadId") ?? "") || undefined,
      type: (String(form.get("type") ?? "") || undefined) as ActivitySearchQuery["type"],
      dueState: (String(form.get("dueState") ?? "") ||
        undefined) as ActivitySearchQuery["dueState"],
      from: String(form.get("from") ?? "") || undefined,
      to: String(form.get("to") ?? "") || undefined,
    });
  }

  return (
    <form className="activity-filter-form" onSubmit={submit} aria-label="Activity filters">
      <label className="field">
        <span>Owner</span>
        <input name="ownerUserId" defaultValue={query.ownerUserId ?? ""} />
      </label>
      <label className="field">
        <span>Team</span>
        <input name="teamId" defaultValue={query.teamId ?? ""} />
      </label>
      <label className="field">
        <span>Lead</span>
        <input name="leadId" defaultValue={query.leadId ?? ""} />
      </label>
      <label className="field">
        <span>Type</span>
        <select name="type" defaultValue={query.type ?? ""}>
          {activityTypes.map((type) => (
            <option key={type || "all"} value={type}>
              {type || "All types"}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Due state</span>
        <select name="dueState" defaultValue={query.dueState ?? ""}>
          {dueStates.map((state) => (
            <option key={state || "all"} value={state}>
              {state || "All states"}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>From</span>
        <input name="from" type="datetime-local" />
      </label>
      <label className="field">
        <span>To</span>
        <input name="to" type="datetime-local" />
      </label>
      <button className="button button--secondary" type="submit">
        Apply filters
      </button>
    </form>
  );
}
