import type { LeadDetail } from "../api/leads-client";

export function LeadSourcePanel({ lead }: { lead: LeadDetail }) {
  return (
    <section aria-label="Lead source">
      <h2>Source</h2>
      <dl>
        <dt>Source code</dt>
        <dd>{lead.sourceCode}</dd>
        <dt>Exhibition</dt>
        <dd>{lead.exhibitionReference?.name ?? "None"}</dd>
        <dt>Exhibition date</dt>
        <dd>{lead.exhibitionReference?.date ?? "Not set"}</dd>
        <dt>Location</dt>
        <dd>{lead.exhibitionReference?.location ?? "Not set"}</dd>
      </dl>
    </section>
  );
}
