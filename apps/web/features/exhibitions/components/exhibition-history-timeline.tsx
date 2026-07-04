import type { ExhibitionHistoryEntry } from "../api/exhibitions-client";

export function ExhibitionHistoryTimeline({ entries }: { entries: ExhibitionHistoryEntry[] }) {
  return (
    <section aria-label="Exhibition history">
      <h2>History</h2>
      {entries.length === 0 ? <p className="empty-state">No exhibition history yet.</p> : null}
      <ol>
        {entries.map((entry) => (
          <li key={entry.id}>
            <strong>{entry.entryType}</strong> {entry.summary}
            <br />
            <small>{new Date(entry.createdAt).toLocaleString()}</small>
          </li>
        ))}
      </ol>
    </section>
  );
}
