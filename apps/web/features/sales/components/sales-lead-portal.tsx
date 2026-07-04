"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  confirmLeadImport,
  createLead,
  downloadLeadImportTemplate,
  exportLeads,
  fileToBase64,
  listLeads,
  listLeadSources,
  previewLeadImport,
  type LeadImportPreviewRow,
  type LeadImportResult,
  type LeadSource,
  type LeadSummary,
} from "../../leads/api/leads-client";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
}

function titleCase(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function SalesLeadPortal() {
  const [sources, setSources] = useState<LeadSource[]>([]);
  const [leads, setLeads] = useState<LeadSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();
  const [search, setSearch] = useState("");
  const [importOpen, setImportOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<LeadImportPreviewRow[]>([]);
  const [importResult, setImportResult] = useState<LeadImportResult | null>(null);
  const [importError, setImportError] = useState<string>();
  const [importLoading, setImportLoading] = useState(false);

  function loadLeads(nextSearch = search) {
    setLoading(true);
    listLeads({ pageSize: 25, search: nextSearch.trim() || undefined })
      .then((result) => setLeads(result.items))
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Unable to load your leads."),
      )
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    listLeadSources()
      .then((result) => setSources(result.items))
      .catch(() => setSources([{ code: "MANUAL_ENTRY", name: "Manual Entry", status: "ACTIVE" }]));
    loadLeads();
  }, []);

  async function submit(formData: FormData) {
    setError(undefined);
    setMessage(undefined);
    try {
      await createLead({
        displayName: String(formData.get("displayName") ?? "").trim() || undefined,
        company: String(formData.get("company") ?? "").trim() || undefined,
        email: String(formData.get("email") ?? "").trim() || undefined,
        phone: String(formData.get("phone") ?? "").trim() || undefined,
        sourceCode: String(formData.get("sourceCode") ?? "MANUAL_ENTRY"),
        priority: "MEDIUM",
        initialNote: String(formData.get("initialNote") ?? "").trim() || undefined,
      });
      setMessage("Lead created.");
      loadLeads();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create lead.");
    }
  }

  async function exportOwnLeads() {
    setError(undefined);
    try {
      await exportLeads("xlsx");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to export your leads.");
    }
  }

  async function downloadTemplate() {
    setError(undefined);
    try {
      await downloadLeadImportTemplate("xlsx");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to download template.");
    }
  }

  async function buildImportPayload() {
    if (!importFile) throw new Error("Choose a .csv or .xlsx file first.");
    return {
      fileName: importFile.name,
      contentBase64: await fileToBase64(importFile),
    };
  }

  async function previewImport() {
    setImportLoading(true);
    setImportError(undefined);
    setImportResult(null);
    try {
      const result = await previewLeadImport(await buildImportPayload());
      setImportPreview(result.rows);
    } catch (err) {
      setImportPreview([]);
      setImportError(err instanceof Error ? err.message : "Unable to preview import.");
    } finally {
      setImportLoading(false);
    }
  }

  async function confirmImport() {
    setImportLoading(true);
    setImportError(undefined);
    try {
      const result = await confirmLeadImport(await buildImportPayload());
      setImportResult(result);
      loadLeads();
    } catch (err) {
      setImportError(err instanceof Error ? err.message : "Unable to import leads.");
    } finally {
      setImportLoading(false);
    }
  }

  return (
    <section className="sales-page" aria-labelledby="sales-leads-title">
      <div className="sales-page__header">
        <p className="eyebrow">Sales lead portal</p>
        <h1 id="sales-leads-title">My Leads</h1>
      </div>

      <div className="sales-lead-actions" aria-label="Lead import and export actions">
        <button
          className="button button--primary"
          type="button"
          onClick={() => setImportOpen(true)}
        >
          Import Leads
        </button>
        <button className="button button--secondary" type="button" onClick={exportOwnLeads}>
          Export My Leads
        </button>
        <button className="button button--secondary" type="button" onClick={downloadTemplate}>
          Download Template
        </button>
      </div>

      <form className="sales-lead-form" action={submit} aria-label="Create sales lead">
        <label className="field">
          <span>Name</span>
          <input name="displayName" required />
        </label>
        <label className="field">
          <span>Company</span>
          <input name="company" />
        </label>
        <label className="field">
          <span>Email</span>
          <input name="email" type="email" />
        </label>
        <label className="field">
          <span>Phone</span>
          <input name="phone" />
        </label>
        <label className="field">
          <span>Source</span>
          <select name="sourceCode" defaultValue="MANUAL_ENTRY">
            {sources.map((source) => (
              <option key={source.code} value={source.code}>
                {source.name}
              </option>
            ))}
          </select>
        </label>
        <label className="field sales-lead-form__note">
          <span>Initial Note</span>
          <textarea name="initialNote" />
        </label>
        <div className="sales-lead-form__actions">
          <button className="button button--primary" type="submit">
            Add lead
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

      <form
        className="sales-lead-search"
        aria-label="Search own leads"
        onSubmit={(event) => {
          event.preventDefault();
          loadLeads(search);
        }}
      >
        <label className="field">
          <span>Search</span>
          <input name="search" value={search} onChange={(event) => setSearch(event.target.value)} />
        </label>
        <button className="button button--secondary" type="submit">
          Search
        </button>
      </form>

      {loading ? <p className="empty-state">Loading your leads...</p> : null}
      {!loading && leads.length === 0 ? (
        <p className="empty-state">No leads available yet. Add your first lead to get started.</p>
      ) : null}
      {leads.length > 0 ? (
        <div className="sales-lead-table-wrap">
          <table className="sales-lead-table">
            <thead>
              <tr>
                <th scope="col">Lead name</th>
                <th scope="col">Company</th>
                <th scope="col">Phone</th>
                <th scope="col">Email</th>
                <th scope="col">Source</th>
                <th scope="col">Status</th>
                <th scope="col">Created At</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <Link href={`/sales/leads/${lead.id}`}>{lead.displayName}</Link>
                  </td>
                  <td>{lead.company ?? "Not provided"}</td>
                  <td>{lead.phone ?? "Not provided"}</td>
                  <td>{lead.email ?? "Not provided"}</td>
                  <td>{lead.sourceCode}</td>
                  <td>
                    <span className="status-pill">{lead.status}</span>
                  </td>
                  <td>{formatDate(lead.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {importOpen ? (
        <SalesImportLeadsModal
          file={importFile}
          preview={importPreview}
          result={importResult}
          error={importError}
          loading={importLoading}
          onFileChange={(file) => {
            setImportFile(file);
            setImportPreview([]);
            setImportResult(null);
            setImportError(undefined);
          }}
          onPreview={previewImport}
          onConfirm={confirmImport}
          onClose={() => {
            setImportOpen(false);
            setImportPreview([]);
            setImportResult(null);
            setImportError(undefined);
          }}
        />
      ) : null}
    </section>
  );
}

function SalesImportLeadsModal({
  file,
  preview,
  result,
  error,
  loading,
  onFileChange,
  onPreview,
  onConfirm,
  onClose,
}: {
  file: File | null;
  preview: LeadImportPreviewRow[];
  result: LeadImportResult | null;
  error?: string;
  loading: boolean;
  onFileChange: (file: File | null) => void;
  onPreview: () => void;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const validRows = preview.filter((row) => row.validationStatus === "VALID").length;
  return (
    <div className="lead-modal-backdrop" role="presentation">
      <div className="lead-modal lead-import-modal" role="dialog" aria-modal="true">
        <div className="lead-modal__header">
          <h2>Import Leads</h2>
          <button className="icon-button" type="button" aria-label="Close import" onClick={onClose}>
            Close
          </button>
        </div>
        <label className="field">
          <span>Spreadsheet file</span>
          <input
            type="file"
            accept=".csv,.xlsx"
            onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
          />
        </label>
        <div className="lead-import-actions">
          <button
            className="button button--secondary"
            type="button"
            disabled={!file || loading}
            onClick={onPreview}
          >
            Preview Import
          </button>
          <button
            className="button button--primary"
            type="button"
            disabled={validRows === 0 || loading}
            onClick={onConfirm}
          >
            Confirm Import
          </button>
          {loading ? <span className="muted-text">Processing...</span> : null}
        </div>
        {error ? (
          <p className="status-message status-message--error" role="alert">
            {error}
          </p>
        ) : null}
        {result ? (
          <p className="status-message" role="status">
            Imported {result.importedCount} leads. Skipped {result.skippedCount}.
          </p>
        ) : null}
        {preview.length > 0 ? (
          <div className="lead-import-preview">
            <table className="lead-import-table">
              <thead>
                <tr>
                  <th scope="col">Row</th>
                  <th scope="col">Name</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Email</th>
                  <th scope="col">Source</th>
                  <th scope="col">Status</th>
                  <th scope="col">Priority</th>
                  <th scope="col">Validation Status</th>
                  <th scope="col">Error Message</th>
                </tr>
              </thead>
              <tbody>
                {preview.map((row) => (
                  <tr key={row.row}>
                    <td>{row.row}</td>
                    <td>{row.name || "Missing"}</td>
                    <td>{row.phone || "Not provided"}</td>
                    <td>{row.email || "Not provided"}</td>
                    <td>{row.source || "Missing"}</td>
                    <td>{titleCase(row.status)}</td>
                    <td>{titleCase(row.priority)}</td>
                    <td>{titleCase(row.validationStatus)}</td>
                    <td>{row.errorMessage || "Valid"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
