"use client";

import { useState } from "react";
import { createTeam } from "../api/teams-client";

export function TeamManagement() {
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();

  async function submit(formData: FormData) {
    setError(undefined);
    setMessage(undefined);

    try {
      await createTeam(String(formData.get("name") ?? "").trim());
      setMessage("Team saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create team.");
    }
  }

  return (
    <section className="team-page" aria-labelledby="teams-title">
      <div className="team-page__header">
        <p className="eyebrow">Team management</p>
        <h1 id="teams-title">Teams</h1>
      </div>
      <form className="team-form" action={submit} aria-label="Create team">
        <label className="field">
          <span>Team name</span>
          <input name="name" required />
        </label>
        <button className="button button--primary" type="submit">
          Create team
        </button>
      </form>
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
