"use client";

import { useEffect, useState } from "react";
import {
  changeLeadStatus,
  listLeadSources,
  updateLead,
  type LeadDetail,
  type LeadPriority,
  type LeadSource,
  type LeadStatus,
} from "../../leads/api/leads-client";
import { LeadNotesPanel } from "../../leads/components/lead-notes-panel";
import { LeadActivityTimeline } from "../../activities/components/lead-activity-timeline";
import { LeadHistoryTimeline } from "../../leads/components/lead-history-timeline";

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function SalesLeadDetail({ lead }: { lead: LeadDetail }) {
  const [currentLead, setCurrentLead] = useState(lead);
  const [sources, setSources] = useState<LeadSource[]>([]);
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    listLeadSources()
      .then((result) => setSources(result.items))
      .catch(() =>
        setSources([
          { code: currentLead.sourceCode, name: currentLead.sourceCode, status: "ACTIVE" },
        ]),
      );
  }, [currentLead.sourceCode]);

  async function submitLeadInfo(formData: FormData) {
    setLoading(true);
    setMessage(undefined);
    setError(undefined);
    try {
      const updated = await updateLead(currentLead.id, {
        displayName: String(formData.get("displayName") ?? "").trim() || undefined,
        company: String(formData.get("company") ?? "").trim() || undefined,
        email: String(formData.get("email") ?? "").trim() || undefined,
        phone: String(formData.get("phone") ?? "").trim() || undefined,
        sourceCode: String(formData.get("sourceCode") ?? currentLead.sourceCode),
        priority: String(formData.get("priority") ?? currentLead.priority) as LeadPriority,
        version: currentLead.version,
      });
      setCurrentLead(updated);
      setMessage("Lead information updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update lead.");
    } finally {
      setLoading(false);
    }
  }

  async function submitStatus(formData: FormData) {
    setLoading(true);
    setMessage(undefined);
    setError(undefined);
    try {
      const updated = await changeLeadStatus(currentLead.id, {
        status: String(formData.get("status") ?? currentLead.status) as LeadStatus,
        reason: String(formData.get("reason") ?? "").trim() || undefined,
        version: currentLead.version,
      });
      setCurrentLead(updated);
      setMessage("Status updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update status.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="sales-page" aria-labelledby="sales-lead-detail-title">
      <div className="sales-page__header">
        <p className="eyebrow">Lead detail</p>
        <h1 id="sales-lead-detail-title">{currentLead.displayName}</h1>
      </div>

      <dl className="sales-detail-grid">
        <div>
          <dt>Name</dt>
          <dd>{currentLead.displayName}</dd>
        </div>
        <div>
          <dt>Company</dt>
          <dd>{currentLead.company ?? "Not provided"}</dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>{currentLead.email ?? "Not provided"}</dd>
        </div>
        <div>
          <dt>Phone</dt>
          <dd>{currentLead.phone ?? "Not provided"}</dd>
        </div>
        <div>
          <dt>Source</dt>
          <dd>{currentLead.sourceCode}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{currentLead.status}</dd>
        </div>
        <div>
          <dt>Priority</dt>
          <dd>{currentLead.priority}</dd>
        </div>
        <div>
          <dt>Created At</dt>
          <dd>{formatDateTime(currentLead.createdAt)}</dd>
        </div>
        <div>
          <dt>Last Updated At</dt>
          <dd>{formatDateTime(currentLead.updatedAt)}</dd>
        </div>
        <div>
          <dt>Created By</dt>
          <dd>{currentLead.createdByDisplayName ?? "Unknown user"}</dd>
        </div>
        <div>
          <dt>Current Owner</dt>
          <dd>{currentLead.ownerDisplayName ?? "Unknown user"}</dd>
        </div>
      </dl>

      <div className="sales-detail-stack">
        <section className="lead-panel" aria-label="Edit lead information">
          <h2>Lead Information</h2>
          <form
            className="sales-lead-form"
            action={submitLeadInfo}
            key={`lead-${currentLead.version}`}
          >
            <label className="field">
              <span>Name</span>
              <input name="displayName" defaultValue={currentLead.displayName} required />
            </label>
            <label className="field">
              <span>Company</span>
              <input name="company" defaultValue={currentLead.company ?? ""} />
            </label>
            <label className="field">
              <span>Email</span>
              <input name="email" type="email" defaultValue={currentLead.email ?? ""} />
            </label>
            <label className="field">
              <span>Phone</span>
              <input name="phone" defaultValue={currentLead.phone ?? ""} />
            </label>
            <label className="field">
              <span>Source</span>
              <select name="sourceCode" defaultValue={currentLead.sourceCode}>
                {sources.map((source) => (
                  <option key={source.code} value={source.code}>
                    {source.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Priority</span>
              <select name="priority" defaultValue={currentLead.priority}>
                {["LOW", "MEDIUM", "HIGH", "URGENT"].map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </label>
            <div className="sales-lead-form__actions">
              <button className="button button--primary" type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save lead"}
              </button>
            </div>
          </form>
        </section>

        <section className="lead-panel" aria-label="Lead status management">
          <h2>Status</h2>
          <form
            className="lead-panel__form"
            action={submitStatus}
            key={`status-${currentLead.version}`}
          >
            <label className="field">
              <span>Pipeline status</span>
              <select name="status" defaultValue={currentLead.status}>
                {[
                  "NEW",
                  "CONTACTED",
                  "QUALIFIED",
                  "PROPOSAL_SENT",
                  "NEGOTIATION",
                  "WON",
                  "LOST",
                ].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Reason</span>
              <textarea name="reason" maxLength={500} />
            </label>
            <button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update status"}
            </button>
          </form>
        </section>

        {message ? <p className="status-message">{message}</p> : null}
        {error ? (
          <p className="status-message status-message--error" role="alert">
            {error}
          </p>
        ) : null}

        <LeadActivityTimeline
          leadId={currentLead.id}
          ownerUserId={currentLead.ownerUserId}
          allowFollowUpReassign={false}
        />
        <LeadNotesPanel lead={currentLead} />
        <LeadHistoryTimeline leadId={currentLead.id} />
      </div>
    </section>
  );
}
