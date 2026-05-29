"use client";

import { useState } from "react";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

type SmokeJob = {
  jobId: string;
  status: string;
  correlationId: string;
};

export function SmokeJobPanel() {
  const [job, setJob] = useState<SmokeJob | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function trigger() {
    setError(null);
    const response = await fetch(`${apiBaseUrl}/foundation/smoke-events`, {
      method: "POST",
      credentials: "include",
    });
    if (!response.ok) {
      setError("Smoke job failed to queue");
      return;
    }
    setJob((await response.json()) as SmokeJob);
  }

  return (
    <section style={{ border: "1px solid var(--border)", padding: 16, maxWidth: 520 }}>
      <h2>Smoke job</h2>
      <button type="button" onClick={trigger}>
        Trigger smoke job
      </button>
      {job ? (
        <p>
          Job {job.jobId}: {job.status}
        </p>
      ) : null}
      {error ? <p role="alert">{error}</p> : null}
    </section>
  );
}
