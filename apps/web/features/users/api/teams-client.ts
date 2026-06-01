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
      const body = (await response.json()) as { message?: unknown };
      if (typeof body.message === "string") {
        message = body.message;
      }
    } catch {
      // Keep the status-based fallback when the API does not return JSON.
    }
    throw new Error(message);
  }
  return (await response.json()) as T;
}

export function listTeams() {
  return request<{ items: unknown[] }>("/teams");
}

export function createTeam(name: string) {
  return request("/teams", { method: "POST", body: JSON.stringify({ name }) });
}

export function replaceTeamMembers(
  teamId: string,
  members: Array<{ userId: string; membershipType: "MEMBER" | "MANAGER" }>,
) {
  return request(`/teams/${teamId}/members`, { method: "PUT", body: JSON.stringify({ members }) });
}
