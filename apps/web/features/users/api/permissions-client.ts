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
  if (!response.ok) {
    let message = `Request failed: ${response.status}`;
    try {
      const body = (await response.json()) as { message?: unknown; error?: unknown };
      if (typeof body.message === "string") {
        message = body.message;
      } else if (Array.isArray(body.message)) {
        message = body.message.join(" ");
      } else if (typeof body.error === "string") {
        message = body.error;
      }
    } catch {
      // Keep the status-based fallback when the API does not return JSON.
    }
    throw new Error(message);
  }
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
