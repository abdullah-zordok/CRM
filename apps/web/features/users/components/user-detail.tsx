import type { UserSummary } from "../api/users-client";
import { RoleAssignmentPanel } from "./role-assignment-panel";

export function UserDetail({ user }: { user: UserSummary }) {
  return (
    <article className="user-card">
      <h2>{user.displayName}</h2>
      <dl className="user-card__meta">
        <div>
          <dt>Email</dt>
          <dd>{user.email}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{user.status}</dd>
        </div>
        <div>
          <dt>Roles</dt>
          <dd>{user.roles.join(", ")}</dd>
        </div>
      </dl>
      <RoleAssignmentPanel user={user} />
    </article>
  );
}
