"use client";

import { useState } from "react";
import {
  attributeLead,
  correctAttribution,
  type AttributionType,
  type ExhibitionDetail,
  type ExhibitionLeadAttribution,
} from "../api/exhibitions-client";

const ATTRIBUTION_TYPES: AttributionType[] = ["SOURCE", "INFLUENCE"];

export function ExhibitionAttributionPanel({
  exhibition,
  onChanged,
}: {
  exhibition: ExhibitionDetail;
  onChanged: () => void;
}) {
  const [error, setError] = useState<string>();
  const [message, setMessage] = useState<string>();

  async function link(formData: FormData) {
    setError(undefined);
    setMessage(undefined);
    try {
      await attributeLead(exhibition.id, {
        leadId: String(formData.get("leadId") ?? "").trim(),
        attributionType: String(formData.get("attributionType") ?? "SOURCE") as AttributionType,
        preserveReference: true,
      });
      setMessage("Lead attributed.");
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to attribute lead");
    }
  }

  async function remove(attribution: ExhibitionLeadAttribution) {
    setError(undefined);
    setMessage(undefined);
    try {
      await correctAttribution(exhibition.id, attribution.id, {
        status: "REMOVED",
        version: attribution.version,
        correctionReason: "Removed from exhibition detail",
      });
      setMessage("Attribution removed.");
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update attribution");
    }
  }

  return (
    <section aria-label="Exhibition lead attribution">
      <h2>Lead attribution</h2>
      <form action={link}>
        <label className="field">
          <span>Lead ID</span>
          <input name="leadId" required />
        </label>
        <label className="field">
          <span>Type</span>
          <select name="attributionType" defaultValue="SOURCE">
            {ATTRIBUTION_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <button className="button button--secondary" type="submit">
          Link lead
        </button>
      </form>
      {message ? <p className="status-message">{message}</p> : null}
      {error ? (
        <p className="status-message status-message--error" role="alert">
          {error}
        </p>
      ) : null}
      {exhibition.attributions.length === 0 ? (
        <p className="empty-state">No leads attributed to this exhibition.</p>
      ) : null}
      <ul>
        {exhibition.attributions.map((attribution) => (
          <li key={attribution.id}>
            {attribution.leadDisplayName} - {attribution.attributionType} - {attribution.status}
            {attribution.status === "ACTIVE" ? (
              <button type="button" onClick={() => remove(attribution)}>
                Remove
              </button>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
