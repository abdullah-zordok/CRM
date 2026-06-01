"use client";

import { useState } from "react";
import { completeActivation } from "../api/users-client";

export function ActivationForm() {
  const [message, setMessage] = useState<string>();

  async function submit(formData: FormData) {
    await completeActivation({
      activationToken: String(formData.get("activationToken")),
      password: String(formData.get("password")),
    });
    setMessage("Activation complete.");
  }

  return (
    <main>
      <h1>Activate account</h1>
      <form action={submit}>
        <label>
          Activation token
          <input name="activationToken" required />
        </label>
        <label>
          Password
          <input name="password" type="password" minLength={12} required />
        </label>
        <button type="submit">Complete setup</button>
      </form>
      {message ? <p>{message}</p> : null}
    </main>
  );
}
