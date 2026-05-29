import { getFoundationStatus } from "@/features/foundation/api/foundation-status";

export default async function FoundationPage() {
  const status = await getFoundationStatus();

  return (
    <main>
      <h1>Foundation Status</h1>
      <p>API readiness: {status.status}</p>
    </main>
  );
}
