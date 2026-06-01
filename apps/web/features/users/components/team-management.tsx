"use client";

import { useState } from "react";
import { createTeam } from "../api/teams-client";

export function TeamManagement() {
  const [message, setMessage] = useState<string>();

  async function submit(formData: FormData) {
    await createTeam(String(formData.get("name")));
    setMessage("Team saved.");
  }

  return (
    <section>
      <h1>Teams</h1>
      <form action={submit}>
        <label>
          Team name
          <input name="name" required />
        </label>
        <button type="submit">Create team</button>
      </form>
      {message ? <p>{message}</p> : null}
    </section>
  );
}
