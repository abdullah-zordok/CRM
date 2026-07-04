import { getBrowserApiBaseUrl } from "../../foundation/api/api-base-url";

const API_BASE_URL = getBrowserApiBaseUrl();

export function searchAudit(query = "") {
  return fetch(`${API_BASE_URL}/audit/security${query}`, {
    credentials: "include",
  }).then((response) => {
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);
    return response.json() as Promise<{ items: unknown[] }>;
  });
}
