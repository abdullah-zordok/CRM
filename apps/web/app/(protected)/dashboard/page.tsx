const dashboardMetrics = [
  { label: "New leads", value: "24", detail: "Queued for qualification" },
  { label: "Follow-ups due", value: "8", detail: "Scheduled for today" },
  { label: "Active deals", value: "12", detail: "Awaiting next action" },
  { label: "Team target", value: "68%", detail: "Placeholder progress" },
];

const pipelineStages = [
  { label: "Captured", value: 42 },
  { label: "Qualified", value: 28 },
  { label: "Proposal", value: 18 },
  { label: "Won", value: 9 },
];

const workQueue = [
  "Review exhibition leads assigned this week",
  "Confirm overdue follow-up ownership",
  "Prepare manager pipeline summary",
];

export default function DashboardPage() {
  return (
    <section className="dashboard-page" aria-labelledby="dashboard-title">
      <div className="dashboard-page__header">
        <div>
          <p className="eyebrow">Workspace overview</p>
          <h1 id="dashboard-title">Dashboard</h1>
          <p className="muted-text">
            Placeholder operational widgets for pipeline health, follow-up focus, and team
            performance. No live business records are exposed in this phase.
          </p>
        </div>
      </div>

      <div className="dashboard-metric-grid" aria-label="Dashboard summary widgets">
        {dashboardMetrics.map((metric) => (
          <article className="dashboard-widget" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <p>{metric.detail}</p>
          </article>
        ))}
      </div>

      <div className="dashboard-grid">
        <article className="dashboard-panel" aria-labelledby="pipeline-title">
          <div className="dashboard-panel__header">
            <h2 id="pipeline-title">Pipeline Snapshot</h2>
            <span className="status-pill">Placeholder</span>
          </div>
          <div className="pipeline-bars">
            {pipelineStages.map((stage) => (
              <div className="pipeline-row" key={stage.label}>
                <span>{stage.label}</span>
                <div className="pipeline-meter" aria-hidden="true">
                  <span style={{ inlineSize: `${stage.value}%` }} />
                </div>
                <strong>{stage.value}</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="dashboard-panel" aria-labelledby="queue-title">
          <div className="dashboard-panel__header">
            <h2 id="queue-title">Today Focus</h2>
            <span className="status-pill">Static</span>
          </div>
          <ul className="dashboard-task-list">
            {workQueue.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
