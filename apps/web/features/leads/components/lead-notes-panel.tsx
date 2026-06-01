"use client";

import { useState } from "react";
import { addLeadNote, type LeadDetail } from "../api/leads-client";

export function LeadNotesPanel({ lead }: { lead: LeadDetail }) {
  const [body, setBody] = useState("");
  const [notes, setNotes] = useState(lead.notes);
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  async function submit(formData: FormData) {
    setLoading(true);
    setMessage(undefined);
    setError(undefined);
    try {
      const result = await addLeadNote(lead.id, {
        body: String(formData.get("body") ?? body),
        version: lead.version,
      });
      setNotes(result.notes);
      setBody("");
      setMessage("Note added.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to add note");
    } finally {
      setLoading(false);
    }
  }

  if (!lead.permissions.canAddNote) {
    return (
      <section aria-label="Lead notes">
        <h2>Notes</h2>
        <p>You do not have permission to add notes to this lead.</p>
      </section>
    );
  }

  return (
    <section aria-label="Lead notes">
      <h2>Notes</h2>
      <form action={submit}>
        <label>
          Note
          <textarea
            name="body"
            required
            maxLength={4000}
            value={body}
            onChange={(event) => setBody(event.target.value)}
          />
        </label>
        <button type="submit" disabled={loading || body.trim().length === 0}>
          {loading ? "Adding..." : "Add note"}
        </button>
      </form>
      {error ? <p role="alert">{error}</p> : null}
      {message ? <p>{message}</p> : null}
      {notes.length === 0 ? <p>No notes yet.</p> : null}
      <ol>
        {notes.map((note) => (
          <li key={note.id}>{note.body}</li>
        ))}
      </ol>
    </section>
  );
}
