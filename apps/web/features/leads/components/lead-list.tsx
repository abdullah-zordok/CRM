"use client";

import { useEffect, useState } from "react";
import { listLeads, type LeadSummary } from "../api/leads-client";
import { LeadFilterBar, type LeadFilters } from "./lead-filter-bar";
import { LeadForm } from "./lead-form";

export function LeadList() {
  const [leads, setLeads] = useState<LeadSummary[]>([]);
  const [error, setError] = useState<string>();

  function load(filters: LeadFilters = {}) {
    listLeads(filters)
      .then((result) => setLeads(result.items))
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Unable to load leads"),
      );
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <section className="lead-page" aria-labelledby="leads-title">
      <div className="lead-page__header">
        <div>
          <p className="eyebrow">Lead management</p>
          <h1 id="leads-title">Leads</h1>
        </div>
      </div>
      <LeadForm />
      <LeadFilterBar onChange={load} />
      {error ? (
        <p className="status-message status-message--error" role="alert">
          {error}
        </p>
      ) : null}
      {leads.length === 0 ? (
        <p className="empty-state">No leads match the current filters.</p>
      ) : null}
      <ul className="lead-list">
        {leads.map((lead) => (
          <li key={lead.id}>
            <a href={`/leads/${lead.id}`}>
              {lead.displayName} - {lead.status} - {lead.priority}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
