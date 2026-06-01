"use client";

import { useState } from "react";
import { searchAudit } from "../api/audit-client";

export function AuditSearch() {
  const [count, setCount] = useState<number>();
  const [error, setError] = useState<string>();

  async function runSearch() {
    try {
      const result = await searchAudit();
      setCount(result.items.length);
      setError(undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to search audit records");
    }
  }

  return (
    <main>
      <h1>Security audit</h1>
      <button type="button" onClick={runSearch}>
        Search
      </button>
      {typeof count === "number" ? <p>{count} records found.</p> : <p>No audit search has run.</p>}
      {error ? <p role="alert">{error}</p> : null}
    </main>
  );
}
