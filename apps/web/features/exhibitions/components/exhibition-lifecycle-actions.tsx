"use client";

import { useState } from "react";
import {
  archiveExhibition,
  restoreExhibition,
  type ExhibitionDetail,
} from "../api/exhibitions-client";

export function ExhibitionLifecycleActions({
  exhibition,
  onChanged,
}: {
  exhibition: ExhibitionDetail;
  onChanged: (exhibition: ExhibitionDetail) => void;
}) {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  async function archive(formData: FormData) {
    setLoading(true);
    setError(undefined);
    try {
      onChanged(
        await archiveExhibition(exhibition.id, {
          version: exhibition.version,
          reason: String(formData.get("reason") ?? "").trim() || undefined,
        }),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to archive exhibition");
    } finally {
      setLoading(false);
    }
  }

  async function restore() {
    setLoading(true);
    setError(undefined);
    try {
      onChanged(
        await restoreExhibition(exhibition.id, {
          version: exhibition.version,
          restoredStatus: "PLANNED",
        }),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to restore exhibition");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section aria-label="Exhibition lifecycle">
      <h2>Lifecycle</h2>
      {exhibition.status === "ARCHIVED" ? (
        <button
          className="button button--secondary"
          type="button"
          onClick={restore}
          disabled={loading}
        >
          Restore
        </button>
      ) : (
        <form action={archive}>
          <label className="field">
            <span>Archive reason</span>
            <input name="reason" maxLength={500} />
          </label>
          <button className="button button--secondary" type="submit" disabled={loading}>
            Archive
          </button>
        </form>
      )}
      {error ? (
        <p className="status-message status-message--error" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
