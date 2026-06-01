"use client";

import { type FormEvent, useState } from "react";
import type { LeadPriority, LeadStatus } from "../api/leads-client";

const STATUSES: Array<"" | LeadStatus> = [
  "",
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "NEGOTIATION",
  "WON",
  "LOST",
  "ARCHIVED",
];
const PRIORITIES: Array<"" | LeadPriority> = ["", "LOW", "MEDIUM", "HIGH", "URGENT"];

export interface LeadFilters {
  search?: string;
  status?: LeadStatus;
  sourceCode?: string;
  priority?: LeadPriority;
  ownerUserId?: string;
  teamId?: string;
  exhibition?: string;
}

export function LeadFilterBar({ onChange }: { onChange: (filters: LeadFilters) => void }) {
  const [filters, setFilters] = useState<LeadFilters>({});

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onChange(filters);
  }

  function update<K extends keyof LeadFilters>(key: K, value: LeadFilters[K] | "") {
    setFilters((current) => ({ ...current, [key]: value || undefined }));
  }

  return (
    <form className="lead-filter-form" onSubmit={submit} aria-label="Lead filters">
      <label className="field">
        <span>Search</span>
        <input
          value={filters.search ?? ""}
          onChange={(event) => update("search", event.target.value)}
        />
      </label>
      <label className="field">
        <span>Status</span>
        <select
          value={filters.status ?? ""}
          onChange={(event) => update("status", event.target.value as LeadStatus | "")}
        >
          {STATUSES.map((status) => (
            <option key={status || "all"} value={status}>
              {status || "All statuses"}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Priority</span>
        <select
          value={filters.priority ?? ""}
          onChange={(event) => update("priority", event.target.value as LeadPriority | "")}
        >
          {PRIORITIES.map((priority) => (
            <option key={priority || "all"} value={priority}>
              {priority || "All priorities"}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Source</span>
        <input
          value={filters.sourceCode ?? ""}
          onChange={(event) => update("sourceCode", event.target.value)}
        />
      </label>
      <label className="field">
        <span>Owner</span>
        <input
          value={filters.ownerUserId ?? ""}
          onChange={(event) => update("ownerUserId", event.target.value)}
        />
      </label>
      <label className="field">
        <span>Team</span>
        <input
          value={filters.teamId ?? ""}
          onChange={(event) => update("teamId", event.target.value)}
        />
      </label>
      <label className="field">
        <span>Exhibition</span>
        <input
          value={filters.exhibition ?? ""}
          onChange={(event) => update("exhibition", event.target.value)}
        />
      </label>
      <button className="button button--secondary lead-filter-form__button" type="submit">
        Apply filters
      </button>
    </form>
  );
}
