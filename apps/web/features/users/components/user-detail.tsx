import type { UserSummary } from "../api/users-client";
import { RoleAssignmentPanel } from "./role-assignment-panel";

export function UserDetail({ user }: { user: UserSummary }) {
  return (
    <article>
      <h2>{user.displayName}</h2>
      <p>{user.email}</p>
      <p>Status: {user.status}</p>
      <p>Roles: {user.roles.join(", ")}</p>
      <RoleAssignmentPanel user={user} />
    </article>
  );
}
