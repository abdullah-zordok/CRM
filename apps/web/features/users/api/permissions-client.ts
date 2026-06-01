import type { UserSummary } from "./users-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "content-type": "application/json",
      ...init?.headers,
    },
  });
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return (await response.json()) as T;
}

export function replaceRoles(userId: string, roles: string[]) {
  return request<UserSummary>(`/users/${userId}/roles`, {
    method: "PUT",
    body: JSON.stringify({ roles }),
  });
}

export function setReviewerAccess(userId: string, enabled: boolean) {
  return request<UserSummary>(`/users/${userId}/reviewer-access`, {
    method: "PUT",
    body: JSON.stringify({ enabled }),
  });
}

export function getPermissionMatrix() {
  return request<{ permissions: Array<{ code: string; grantedTo: string[] }> }>(
    "/permissions/matrix",
  );
}
