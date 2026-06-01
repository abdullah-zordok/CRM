"use client";

import { useState } from "react";
import { createUser } from "../api/users-client";

export function UserForm() {
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();

  async function submit(formData: FormData) {
    setError(undefined);
    setMessage(undefined);

    try {
      await createUser({
        email: String(formData.get("email") ?? "").trim(),
        displayName: String(formData.get("displayName") ?? "").trim(),
        roles: [String(formData.get("role") ?? "SALES_REPRESENTATIVE")],
        status: "PENDING_ACTIVATION",
      });
      setMessage("User created with activation pending.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create user.");
    }
  }

  return (
    <form className="user-form" action={submit} aria-label="Create user">
      <label className="field">
        <span>Email</span>
        <input name="email" type="email" required />
      </label>
      <label className="field">
        <span>Display name</span>
        <input name="displayName" required />
      </label>
      <label className="field">
        <span>Role</span>
        <select name="role" defaultValue="SALES_REPRESENTATIVE">
          <option value="ADMIN">Admin</option>
          <option value="MANAGER">Manager</option>
          <option value="SALES_REPRESENTATIVE">Sales Representative</option>
        </select>
      </label>
      <div className="user-form__actions">
        <button className="button button--primary" type="submit">
          Create user
        </button>
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
      </div>
    </form>
  );
}
