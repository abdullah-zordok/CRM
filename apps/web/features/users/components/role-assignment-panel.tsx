"use client";

import { useState } from "react";
import type { UserSummary } from "../api/users-client";
import { replaceRoles, setReviewerAccess } from "../api/permissions-client";

export function RoleAssignmentPanel({
  user,
  onUserUpdated,
}: {
  user: UserSummary;
  onUserUpdated?: (user: UserSummary) => void;
}) {
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();

  async function assign(role: string) {
    setError(undefined);
    setMessage(undefined);

    try {
      const updated = await replaceRoles(user.id, [role]);
      onUserUpdated?.(updated);
      setMessage("Access updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update access.");
    }
  }

  async function toggleReviewer() {
    setError(undefined);
    setMessage(undefined);

    try {
      const updated = await setReviewerAccess(user.id, !user.hasReviewerAccess);
      onUserUpdated?.(updated);
      setMessage("Reviewer access updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update reviewer access.");
    }
  }

  return (
    <section className="access-panel" aria-labelledby={`access-${user.id}`}>
      <h3 id={`access-${user.id}`}>Access</h3>
      <div className="access-panel__actions">
        <button className="button button--secondary" type="button" onClick={() => assign("ADMIN")}>
          Admin
        </button>
        <button
          className="button button--secondary"
          type="button"
          onClick={() => assign("MANAGER")}
        >
          Manager
        </button>
        <button
          className="button button--secondary"
          type="button"
          onClick={() => assign("SALES_REPRESENTATIVE")}
        >
          Sales Representative
        </button>
        <button className="button button--secondary" type="button" onClick={toggleReviewer}>
          Toggle audit reviewer
        </button>
      </div>
      {message ? (
        <p className="status-message" role="status">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="status-message status-message--error" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
