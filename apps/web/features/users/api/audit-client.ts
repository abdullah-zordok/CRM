const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

export function searchAudit(query = "") {
  return fetch(`${API_BASE_URL}/audit/security${query}`, {
    credentials: "include",
  }).then((response) => {
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);
    return response.json() as Promise<{ items: unknown[] }>;
  });
}
