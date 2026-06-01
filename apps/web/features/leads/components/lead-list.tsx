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
    <section>
      <h1>Leads</h1>
      <LeadForm />
      <LeadFilterBar onChange={load} />
      {error ? <p role="alert">{error}</p> : null}
      {leads.length === 0 ? <p>No leads match the current filters.</p> : null}
      <ul>
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
