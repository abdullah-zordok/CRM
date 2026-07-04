import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Bell, Building2, UserCircle } from "lucide-react";
import { getServerApiBaseUrl } from "../../features/foundation/api/api-base-url";
import { LogoutButton } from "../../features/foundation/auth/logout-button";
import { AccessibilityFrame } from "../../features/workspace/components/accessibility-frame";
import { WorkspaceNavigation } from "../../features/workspace/components/workspace-navigation";

const API_BASE_URL = getServerApiBaseUrl();

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const e2eBypass =
    process.env.CRM_E2E_AUTH_BYPASS === "true" && cookieStore.get("crm_e2e_auth")?.value === "1";

  if (!e2eBypass) {
    let response: Response;
    try {
      response = await fetch(`${API_BASE_URL}/auth/me`, {
        cache: "no-store",
        headers: {
          cookie: cookieStore.toString(),
        },
      });
    } catch {
      redirect("/login");
    }

    if (!response.ok) {
      redirect("/login");
    }
  }

  return (
    <AccessibilityFrame>
      <div className="workspace-shell">
        <WorkspaceNavigation />
        <div className="workspace-main">
          <header className="workspace-header">
            <div>
              <p className="eyebrow">Protected workspace</p>
              <strong>Sales Operations CRM</strong>
            </div>
            <div className="workspace-header__actions">
              <div className="workspace-tools" aria-label="Workspace tools">
                <button
                  className="icon-button"
                  type="button"
                  aria-label="Company switcher placeholder"
                >
                  <Building2 size={18} aria-hidden="true" />
                </button>
                <button
                  className="icon-button"
                  type="button"
                  aria-label="Notifications placeholder"
                >
                  <Bell size={18} aria-hidden="true" />
                </button>
                <button className="icon-button" type="button" aria-label="User menu placeholder">
                  <UserCircle size={18} aria-hidden="true" />
                </button>
              </div>
              <LogoutButton />
            </div>
          </header>
          <main id="main-content" className="workspace-content">
            {children}
          </main>
        </div>
      </div>
    </AccessibilityFrame>
  );
}
