"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Filter, Search, UserRound, Users } from "lucide-react";
import {
  getOperationsDashboard,
  type DashboardLeadStatus,
  type OperationsDashboardQuery,
  type OperationsDashboardResponse,
} from "../api/operations-dashboard-client";

const STATUSES: Array<"" | DashboardLeadStatus> = [
  "",
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL_SENT",
  "NEGOTIATION",
  "WON",
  "LOST",
  "ARCHIVED",
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function OperationsDashboard() {
  const router = useRouter();
  const [query, setQuery] = useState<OperationsDashboardQuery>({ page: 1, pageSize: 10 });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"" | DashboardLeadStatus>("");
  const [data, setData] = useState<OperationsDashboardResponse | null>(null);
  const [error, setError] = useState<string>();

  useEffect(() => {
    let active = true;
    setError(undefined);
    getOperationsDashboard(query)
      .then((result) => {
        if (active) setData(result);
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Unable to load dashboard.");
        }
      });
    return () => {
      active = false;
    };
  }, [query]);

  function submitFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setQuery((current) => ({
      ...current,
      search: search.trim() || undefined,
      status: status || undefined,
      page: 1,
    }));
  }

  function goToPage(page: number) {
    setQuery((current) => ({ ...current, page }));
  }

  if (error) {
    return <p className="status-message status-message--error">Dashboard unavailable.</p>;
  }

  if (!data) {
    return <p className="empty-state">Loading dashboard...</p>;
  }

  const visibleUsers = data.usersOverview.slice(0, 5);
  const hasMoreUsers = data.usersOverview.length > visibleUsers.length;
  const page = data.pagination.page;
  const totalPages = data.pagination.totalPages;

  return (
    <>
      <div className="dashboard-metric-grid" aria-label="Dashboard summary">
        <article className="dashboard-summary-card">
          <div className="dashboard-summary-card__icon dashboard-summary-card__icon--green">
            <Users size={22} aria-hidden="true" />
          </div>
          <div>
            <span>Total Leads</span>
            <strong>{data.summary.totalLeads}</strong>
            <p>{data.scope === "ADMIN_GLOBAL" ? "All teams" : "Team scope"}</p>
          </div>
        </article>
        <article className="dashboard-summary-card">
          <div className="dashboard-summary-card__icon dashboard-summary-card__icon--violet">
            <UserRound size={22} aria-hidden="true" />
          </div>
          <div>
            <span>Total Users</span>
            <strong>{data.summary.totalUsers}</strong>
            <p>Active users</p>
          </div>
        </article>
        <article className="dashboard-summary-card">
          <div className="dashboard-summary-card__icon dashboard-summary-card__icon--blue">
            <UserRound size={22} aria-hidden="true" />
          </div>
          <div>
            <span>Sales Representatives</span>
            <strong>{data.summary.salesRepresentatives}</strong>
            <p>Active representatives</p>
          </div>
        </article>
      </div>

      <article className="dashboard-panel dashboard-users-panel">
        <div className="dashboard-panel__header">
          <h2>Users Overview</h2>
          {hasMoreUsers ? (
            <Link className="button button--secondary" href="/users">
              View all users
            </Link>
          ) : null}
        </div>
        {visibleUsers.length === 0 ? (
          <p className="empty-state">No active users in this scope.</p>
        ) : (
          <div className="dashboard-user-cards" aria-label="Users overview">
            {visibleUsers.map((user, index) => (
              <article className="dashboard-user-card" key={user.id}>
                <div className={`dashboard-avatar dashboard-avatar--${(index % 5) + 1}`}>
                  {initials(user.displayName)}
                </div>
                <div className="dashboard-user-card__body">
                  <strong>{user.displayName}</strong>
                  <span>{user.email}</span>
                </div>
                <div className="dashboard-user-card__count">
                  <span>Leads</span>
                  <strong>{user.leadCount}</strong>
                </div>
              </article>
            ))}
          </div>
        )}
      </article>

      <article className="dashboard-panel dashboard-panel--full">
        <div className="dashboard-panel__header dashboard-panel__header--table">
          <h2>All Leads</h2>
          <form
            className="dashboard-lead-tools"
            onSubmit={submitFilters}
            aria-label="Lead table filters"
          >
            <label className="dashboard-search">
              <Search size={17} aria-hidden="true" />
              <span className="sr-only">Search leads</span>
              <input
                value={search}
                placeholder="Search leads..."
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
            <label className="dashboard-status-filter">
              <span className="sr-only">Lead status</span>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as "" | DashboardLeadStatus)}
              >
                {STATUSES.map((item) => (
                  <option key={item || "all"} value={item}>
                    {item || "All statuses"}
                  </option>
                ))}
              </select>
            </label>
            <button className="icon-button" type="submit" aria-label="Filter leads">
              <Filter size={17} aria-hidden="true" />
            </button>
          </form>
        </div>
        {data.leads.length === 0 ? (
          <p className="empty-state">No leads match the current filters.</p>
        ) : (
          <div className="dashboard-table-wrap">
            <table className="dashboard-table dashboard-leads-table">
              <thead>
                <tr>
                  <th scope="col">Lead Name</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Email</th>
                  <th scope="col">Created By</th>
                  <th scope="col">Current Owner</th>
                  <th scope="col">Created At</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.leads.map((lead) => (
                  <tr
                    key={lead.id}
                    tabIndex={0}
                    role="link"
                    aria-label={`Open ${lead.name}`}
                    onClick={() => router.push(`/leads/${lead.id}`)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        router.push(`/leads/${lead.id}`);
                      }
                    }}
                  >
                    <td>
                      <span className="dashboard-table__row-link">{lead.name}</span>
                    </td>
                    <td>{lead.phone ?? "Not provided"}</td>
                    <td>{lead.email ?? "Not provided"}</td>
                    <td>{lead.createdBy?.displayName ?? "Unknown"}</td>
                    <td>{lead.currentOwner?.displayName ?? "Unknown"}</td>
                    <td>{formatDate(lead.createdAt)}</td>
                    <td>
                      <span className="status-pill">{lead.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="dashboard-pagination" aria-label="Lead pagination">
          <span>
            Showing {data.leads.length === 0 ? 0 : (page - 1) * data.pagination.pageSize + 1} to{" "}
            {Math.min(page * data.pagination.pageSize, data.pagination.total)} of{" "}
            {data.pagination.total} leads
          </span>
          <div>
            <button
              className="icon-button"
              type="button"
              aria-label="Previous page"
              disabled={page <= 1}
              onClick={() => goToPage(page - 1)}
            >
              <ChevronLeft size={17} aria-hidden="true" />
            </button>
            <span className="dashboard-pagination__current">
              {page} / {totalPages}
            </span>
            <button
              className="icon-button"
              type="button"
              aria-label="Next page"
              disabled={page >= totalPages}
              onClick={() => goToPage(page + 1)}
            >
              <ChevronRight size={17} aria-hidden="true" />
            </button>
          </div>
        </div>
      </article>
    </>
  );
}
