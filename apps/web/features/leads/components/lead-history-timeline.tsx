"use client";

import { useEffect, useState } from "react";
import { getLeadHistory, type LeadHistoryEntry } from "../api/leads-client";

export function LeadHistoryTimeline({ leadId }: { leadId: string }) {
  const [entries, setEntries] = useState<LeadHistoryEntry[]>([]);
  const [error, setError] = useState<string>();

  useEffect(() => {
    getLeadHistory(leadId)
      .then((result) => setEntries(result.items))
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Unable to load history"),
      );
  }, [leadId]);

  return (
    <section aria-label="Lead history">
      <h2>History</h2>
      {error ? <p role="alert">{error}</p> : null}
      {entries.length === 0 ? <p>No history entries yet.</p> : null}
      <ol>
        {entries.map((entry) => (
          <li key={entry.id}>
            {entry.entryType}: {entry.summary}
          </li>
        ))}
      </ol>
    </section>
  );
}
