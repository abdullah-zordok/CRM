"use client";

import { useState } from "react";
import { createUser } from "../api/users-client";

export function UserForm() {
  const [message, setMessage] = useState<string>();

  async function submit(formData: FormData) {
    await createUser({
      email: String(formData.get("email")),
      displayName: String(formData.get("displayName")),
      roles: [String(formData.get("role") ?? "SALES_REPRESENTATIVE")],
      status: "PENDING_ACTIVATION",
    });
    setMessage("User created with activation pending.");
  }

  return (
    <form action={submit}>
      <label>
        Email
        <input name="email" type="email" required />
      </label>
      <label>
        Display name
        <input name="displayName" required />
      </label>
      <label>
        Role
        <select name="role" defaultValue="SALES_REPRESENTATIVE">
          <option value="ADMIN">Admin</option>
          <option value="MANAGER">Manager</option>
          <option value="SALES_REPRESENTATIVE">Sales Representative</option>
        </select>
      </label>
      <button type="submit">Create user</button>
      {message ? <p>{message}</p> : null}
    </form>
  );
}
