"use client";

import { useEffect, useState } from "react";
import { listUsers, type UserSummary } from "../api/users-client";
import { UserForm } from "./user-form";
import { UserDetail } from "./user-detail";

export function UserList() {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [error, setError] = useState<string>();

  useEffect(() => {
    listUsers()
      .then((result) => setUsers(result.items))
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Unable to load users"),
      );
  }, []);

  return (
    <section className="user-page" aria-labelledby="users-title">
      <div className="user-page__header">
        <p className="eyebrow">User administration</p>
        <h1 id="users-title">Users</h1>
      </div>
      <UserForm />
      {error ? (
        <p className="status-message status-message--error" role="alert">
          {error}
        </p>
      ) : null}
      {users.length === 0 ? (
        <p className="empty-state">No users match the current filters.</p>
      ) : null}
      <ul className="user-list">
        {users.map((user) => (
          <li key={user.id}>
            <UserDetail user={user} />
          </li>
        ))}
      </ul>
    </section>
  );
}
