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
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export interface UserSummary {
  id: string;
  email: string;
  displayName: string;
  status: "PENDING_ACTIVATION" | "ACTIVE" | "DISABLED";
  roles: string[];
  hasReviewerAccess: boolean;
}

export function listUsers() {
  return request<{ items: UserSummary[] }>("/users");
}

export function createUser(input: Record<string, unknown>) {
  return request<UserSummary>("/users", { method: "POST", body: JSON.stringify(input) });
}

export function updateUser(userId: string, input: Record<string, unknown>) {
  return request<UserSummary>(`/users/${userId}`, { method: "PATCH", body: JSON.stringify(input) });
}

export function resendActivation(userId: string) {
  return request(`/users/${userId}/activation`, { method: "POST" });
}

export function completeActivation(input: { activationToken: string; password: string }) {
  return request<void>("/activation/complete", { method: "POST", body: JSON.stringify(input) });
}
