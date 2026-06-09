import type { ExhibitionPerformanceSummary } from "../api/exhibitions-client";

export function ExhibitionPerformanceSummary({
  summary,
}: {
  summary: ExhibitionPerformanceSummary;
}) {
  return (
    <section aria-label="Exhibition performance">
      <h2>Performance</h2>
      <dl>
        <dt>Attributed leads</dt>
        <dd>{summary.attributedLeadCount}</dd>
        <dt>Attendees</dt>
        <dd>
          {summary.confirmedAttendanceCount} confirmed of {summary.attendeeCount}
        </dd>
        <dt>Open follow-ups</dt>
        <dd>{summary.openFollowUpCount}</dd>
        <dt>Overdue follow-ups</dt>
        <dd>{summary.overdueFollowUpCount}</dd>
        <dt>Recent activity</dt>
        <dd>{summary.recentActivityCount}</dd>
      </dl>
      {Object.keys(summary.leadStatusDistribution).length === 0 ? (
        <p className="empty-state">No attributed lead status data yet.</p>
      ) : (
        <ul>
          {Object.entries(summary.leadStatusDistribution).map(([status, count]) => (
            <li key={status}>
              {status}: {count}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
