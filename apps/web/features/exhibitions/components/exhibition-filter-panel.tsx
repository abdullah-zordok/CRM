"use client";

import { type FormEvent, useState } from "react";
import type { ExhibitionSearchQuery, ExhibitionStatus } from "../api/exhibitions-client";

const STATUS_OPTIONS: Array<"" | ExhibitionStatus> = [
  "",
  "PLANNED",
  "ACTIVE",
  "COMPLETED",
  "CANCELED",
  "ARCHIVED",
];

export function ExhibitionFilterPanel({
  onChange,
}: {
  onChange: (filters: ExhibitionSearchQuery) => void;
}) {
  const [filters, setFilters] = useState<ExhibitionSearchQuery>({});

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onChange(filters);
  }

  function update<K extends keyof ExhibitionSearchQuery>(
    key: K,
    value: ExhibitionSearchQuery[K] | "",
  ) {
    setFilters((current) => ({ ...current, [key]: value || undefined }));
  }

  return (
    <form className="lead-filter-form" onSubmit={submit} aria-label="Exhibition filters">
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
          onChange={(event) => update("status", event.target.value as ExhibitionStatus | "")}
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status || "all"} value={status}>
              {status || "All statuses"}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Location</span>
        <input
          value={filters.location ?? ""}
          onChange={(event) => update("location", event.target.value)}
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
      <button className="button button--secondary lead-filter-form__button" type="submit">
        Apply filters
      </button>
    </form>
  );
}
