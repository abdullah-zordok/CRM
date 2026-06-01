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
    <main>
      <h1>Users</h1>
      <UserForm />
      {error ? <p role="alert">{error}</p> : null}
      {users.length === 0 ? <p>No users match the current filters.</p> : null}
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <UserDetail user={user} />
          </li>
        ))}
      </ul>
    </main>
  );
}
