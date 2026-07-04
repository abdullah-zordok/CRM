import { getBrowserApiBaseUrl } from "./api-base-url";

export type FoundationStatus = {
  status: "UP" | "DEGRADED" | "DOWN";
  correlationId?: string;
};

export async function getFoundationStatus(): Promise<FoundationStatus> {
  const baseUrl = getBrowserApiBaseUrl();

  try {
    const response = await fetch(`${baseUrl}/health/ready`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return { status: "DOWN" };
    }

    return (await response.json()) as FoundationStatus;
  } catch {
    return { status: "DOWN" };
  }
}
