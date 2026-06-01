"use client";

import { useEffect, useMemo, useState } from "react";
import { listUsers, type UserSummary } from "../../users/api/users-client";
import { assignLead, type LeadDetail } from "../api/leads-client";

export function LeadAssignmentPanel({ lead }: { lead: LeadDetail }) {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [selectedUserId, setSelectedUserId] = useState(lead.ownerUserId);
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    listUsers()
      .then((result) => setUsers(result.items))
      .catch(() => setUsers([]));
  }, []);

  const eligibleUsers = useMemo(
    () =>
      users.filter(
        (user) => user.status === "ACTIVE" && user.roles.includes("SALES_REPRESENTATIVE"),
      ),
    [users],
  );

  async function submit(formData: FormData) {
    setLoading(true);
    setError(undefined);
    setMessage(undefined);
    try {
      const ownerUserId = String(formData.get("ownerUserId") ?? selectedUserId);
      await assignLead(lead.id, {
        ownerUserId,
        reason: String(formData.get("reason") ?? reason) || undefined,
        version: lead.version,
      });
      setSelectedUserId(ownerUserId);
      setMessage("Assignment updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update assignment");
    } finally {
      setLoading(false);
    }
  }

  if (!lead.permissions.canAssign) {
    return (
      <section aria-label="Lead assignment">
        <h2>Assignment</h2>
        <p>You do not have permission to assign this lead.</p>
      </section>
    );
  }

  return (
    <section aria-label="Lead assignment">
      <h2>Assignment</h2>
      <form action={submit}>
        <label>
          Owner
          <select
            name="ownerUserId"
            value={selectedUserId}
            onChange={(event) => setSelectedUserId(event.target.value)}
          >
            <option value={lead.ownerUserId}>Current owner</option>
            {eligibleUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.displayName}
              </option>
            ))}
          </select>
        </label>
        <label>
          Reason
          <textarea
            name="reason"
            maxLength={500}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
        </label>
        <button type="submit" disabled={loading || !selectedUserId}>
          {loading ? "Assigning..." : "Assign lead"}
        </button>
      </form>
      {error ? <p role="alert">{error}</p> : null}
      {message ? <p>{message}</p> : null}
      <h3>Assignment history</h3>
      {lead.assignmentHistory.length === 0 ? <p>No assignment changes yet.</p> : null}
      <ol>
        {lead.assignmentHistory.map((assignment) => (
          <li key={assignment.id}>
            {assignment.fromUserId ?? "Unassigned"} to {assignment.toUserId}
            {assignment.reason ? ` - ${assignment.reason}` : ""}
          </li>
        ))}
      </ol>
    </section>
  );
}
