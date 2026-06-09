import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoutButton } from "../../features/foundation/auth/logout-button";
import {
  getServerCurrentUser,
  isMainWorkspaceUser,
  isSalesRepresentative,
} from "../../features/foundation/auth/server-session";

export default async function SalesLayout({ children }: { children: ReactNode }) {
  const user = await getServerCurrentUser();
  if (!user) redirect("/login");
  if (isMainWorkspaceUser(user) || !isSalesRepresentative(user)) redirect("/dashboard");

  return (
    <div className="sales-shell">
      <header className="sales-header">
        <Link className="brand-mark brand-mark--workspace" href="/sales/leads">
          <span className="brand-symbol" aria-hidden="true">
            SO
          </span>
          <span>Sales Operations</span>
        </Link>
        <nav className="sales-nav" aria-label="Sales portal navigation">
          <Link href="/sales/leads">Leads</Link>
        </nav>
        <div className="sales-header__actions">
          <span className="sales-user">{user.displayName}</span>
          <LogoutButton />
        </div>
      </header>
      <main className="sales-content">{children}</main>
    </div>
  );
}
