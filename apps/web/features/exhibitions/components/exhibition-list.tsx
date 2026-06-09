"use client";

import { useEffect, useState } from "react";
import {
  searchExhibitions,
  type ExhibitionSearchQuery,
  type ExhibitionSummary,
} from "../api/exhibitions-client";
import { ExhibitionFilterPanel } from "./exhibition-filter-panel";
import { ExhibitionForm } from "./exhibition-form";

function formatDateRange(exhibition: ExhibitionSummary) {
  const start = new Date(exhibition.startsAt).toLocaleDateString();
  const end = new Date(exhibition.endsAt).toLocaleDateString();
  return start === end ? start : `${start} - ${end}`;
}

export function ExhibitionList() {
  const [exhibitions, setExhibitions] = useState<ExhibitionSummary[]>([]);
  const [filters, setFilters] = useState<ExhibitionSearchQuery>({});
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  function load(nextFilters: ExhibitionSearchQuery = filters) {
    setLoading(true);
    setError(undefined);
    setFilters(nextFilters);
    searchExhibitions(nextFilters)
      .then((result) => setExhibitions(result.items))
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Unable to load exhibitions"),
      )
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load({});
  }, []);

  return (
    <section className="lead-page" aria-labelledby="exhibitions-title">
      <div className="lead-page__header">
        <div>
          <p className="eyebrow">Exhibition management</p>
          <h1 id="exhibitions-title">Exhibitions</h1>
        </div>
      </div>
      <ExhibitionForm onCreated={() => load(filters)} />
      <ExhibitionFilterPanel onChange={load} />
      {loading ? <p className="status-message">Loading exhibitions...</p> : null}
      {error ? (
        <p className="status-message status-message--error" role="alert">
          {error}
        </p>
      ) : null}
      {!loading && exhibitions.length === 0 ? (
        <p className="empty-state">No exhibitions match the current filters.</p>
      ) : null}
      <ul className="lead-list">
        {exhibitions.map((exhibition) => (
          <li key={exhibition.id}>
            <a href={`/exhibitions/${exhibition.id}`}>
              {exhibition.name} - {exhibition.status} - {formatDateRange(exhibition)}
            </a>
            <p>
              {exhibition.location} | {exhibition.attendeeCount} attendees |{" "}
              {exhibition.attributedLeadCount} attributed leads
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
