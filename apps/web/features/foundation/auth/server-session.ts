import { cookies } from "next/headers";
import { getServerApiBaseUrl } from "../api/api-base-url";

const API_BASE_URL = getServerApiBaseUrl();

export interface ServerCurrentUser {
  id: string;
  email: string;
  displayName: string;
  roles: string[];
  hasReviewerAccess: boolean;
}

export async function getServerCurrentUser(): Promise<ServerCurrentUser | null> {
  const cookieStore = await cookies();
  const e2eBypass =
    process.env.CRM_E2E_AUTH_BYPASS === "true" && cookieStore.get("crm_e2e_auth")?.value === "1";

  if (e2eBypass) {
    return {
      id: "e2e-user",
      email: "e2e@example.com",
      displayName: "E2E User",
      roles: ["ADMIN"],
      hasReviewerAccess: false,
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      cache: "no-store",
      headers: {
        cookie: cookieStore.toString(),
      },
    });
    if (!response.ok) return null;
    return (await response.json()) as ServerCurrentUser;
  } catch {
    return null;
  }
}

export function isSalesRepresentative(user: ServerCurrentUser) {
  return user.roles.includes("SALES_REPRESENTATIVE") && !isMainWorkspaceUser(user);
}

export function isMainWorkspaceUser(user: ServerCurrentUser) {
  return user.roles.includes("ADMIN") || user.roles.includes("MANAGER");
}
