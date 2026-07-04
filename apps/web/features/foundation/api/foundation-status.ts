export type FoundationStatus = {
  status: "UP" | "DEGRADED" | "DOWN";
  correlationId?: string;
};

export async function getFoundationStatus(): Promise<FoundationStatus> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3501";

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
