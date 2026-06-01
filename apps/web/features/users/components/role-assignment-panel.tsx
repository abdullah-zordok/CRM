"use client";

import type { UserSummary } from "../api/users-client";
import { replaceRoles, setReviewerAccess } from "../api/permissions-client";

export function RoleAssignmentPanel({ user }: { user: UserSummary }) {
  async function assign(role: string) {
    await replaceRoles(user.id, [role]);
  }

  async function toggleReviewer() {
    await setReviewerAccess(user.id, !user.hasReviewerAccess);
  }

  return (
    <section>
      <h3>Access</h3>
      <button type="button" onClick={() => assign("ADMIN")}>
        Admin
      </button>
      <button type="button" onClick={() => assign("MANAGER")}>
        Manager
      </button>
      <button type="button" onClick={() => assign("SALES_REPRESENTATIVE")}>
        Sales Representative
      </button>
      <button type="button" onClick={toggleReviewer}>
        Toggle audit reviewer
      </button>
    </section>
  );
}
