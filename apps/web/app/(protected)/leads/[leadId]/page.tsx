import { getLead } from "../../../../features/leads/api/leads-client";
import { LeadAssignmentPanel } from "../../../../features/leads/components/lead-assignment-panel";
import { LeadHistoryTimeline } from "../../../../features/leads/components/lead-history-timeline";
import { LeadNotesPanel } from "../../../../features/leads/components/lead-notes-panel";
import { LeadSourcePanel } from "../../../../features/leads/components/lead-source-panel";
import { LeadStatusControl } from "../../../../features/leads/components/lead-status-control";

export default async function LeadDetailPage({ params }: { params: Promise<{ leadId: string }> }) {
  const { leadId } = await params;
  const lead = await getLead(leadId);

  return (
    <section>
      <h1>{lead.displayName}</h1>
      <dl>
        <dt>Status</dt>
        <dd>{lead.status}</dd>
        <dt>Priority</dt>
        <dd>{lead.priority}</dd>
        <dt>Source</dt>
        <dd>{lead.sourceCode}</dd>
        <dt>Owner</dt>
        <dd>{lead.ownerUserId}</dd>
        <dt>Version</dt>
        <dd>{lead.version}</dd>
      </dl>
      <LeadSourcePanel lead={lead} />
      <LeadStatusControl lead={lead} />
      <LeadAssignmentPanel lead={lead} />
      <LeadNotesPanel lead={lead} />
      <LeadHistoryTimeline leadId={lead.id} />
    </section>
  );
}
