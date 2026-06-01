"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { workspaceDestinations } from "../navigation/workspace-destinations";

export function WorkspaceNavigation() {
  const pathname = usePathname();

  return (
    <>
      <aside className="workspace-sidebar" aria-label="Workspace navigation">
        <Link className="brand-mark brand-mark--workspace" href="/dashboard">
          <span className="brand-symbol" aria-hidden="true">
            SO
          </span>
          <span>Sales Operations</span>
        </Link>
        <nav className="workspace-nav">
          {workspaceDestinations.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                className={
                  active ? "workspace-nav__item workspace-nav__item--active" : "workspace-nav__item"
                }
                href={item.href}
                aria-current={active ? "page" : undefined}
              >
                <Icon size={18} aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="mobile-workspace-nav">
        <label className="field field--compact" htmlFor="workspace-route">
          <span>Workspace</span>
          <select
            id="workspace-route"
            value={
              workspaceDestinations.find((item) => pathname.startsWith(item.href))?.href ??
              "/dashboard"
            }
            onChange={(event) => {
              window.location.href = event.currentTarget.value;
            }}
          >
            {workspaceDestinations.map((item) => (
              <option key={item.href} value={item.href}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </>
  );
}
