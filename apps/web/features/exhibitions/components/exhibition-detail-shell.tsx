"use client";

import { useEffect, useState } from "react";
import { getExhibition, type ExhibitionDetail } from "../api/exhibitions-client";
import { ExhibitionAttendeePanel } from "./exhibition-attendee-panel";
import { ExhibitionAttributionPanel } from "./exhibition-attribution-panel";
import { ExhibitionHistoryTimeline } from "./exhibition-history-timeline";
import { ExhibitionLifecycleActions } from "./exhibition-lifecycle-actions";
import { ExhibitionPerformanceSummary } from "./exhibition-performance-summary";

export function ExhibitionDetailShell({ exhibitionId }: { exhibitionId: string }) {
  const [exhibition, setExhibition] = useState<ExhibitionDetail>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    setError(undefined);
    getExhibition(exhibitionId)
      .then(setExhibition)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Unable to load exhibition"),
      )
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, [exhibitionId]);

  if (loading && !exhibition) return <p className="status-message">Loading exhibition...</p>;
  if (error) {
    return (
      <p className="status-message status-message--error" role="alert">
        {error}
      </p>
    );
  }
  if (!exhibition) return <p className="empty-state">Exhibition is unavailable.</p>;

  return (
    <section className="lead-page" aria-labelledby="exhibition-title">
      <div className="lead-page__header">
        <div>
          <p className="eyebrow">Exhibition detail</p>
          <h1 id="exhibition-title">{exhibition.name}</h1>
        </div>
      </div>
      <dl>
        <dt>Status</dt>
        <dd>{exhibition.status}</dd>
        <dt>Dates</dt>
        <dd>
          {new Date(exhibition.startsAt).toLocaleString()} -{" "}
          {new Date(exhibition.endsAt).toLocaleString()}
        </dd>
        <dt>Location</dt>
        <dd>{exhibition.location}</dd>
        <dt>Owner</dt>
        <dd>{exhibition.ownerUserId}</dd>
        <dt>Version</dt>
        <dd>{exhibition.version}</dd>
      </dl>
      {exhibition.notes ? <p>{exhibition.notes}</p> : null}
      <ExhibitionPerformanceSummary summary={exhibition.summary} />
      <ExhibitionLifecycleActions exhibition={exhibition} onChanged={setExhibition} />
      <ExhibitionAttendeePanel exhibition={exhibition} onChanged={load} />
      <ExhibitionAttributionPanel exhibition={exhibition} onChanged={load} />
      <ExhibitionHistoryTimeline entries={exhibition.historyEntries} />
    </section>
  );
}
