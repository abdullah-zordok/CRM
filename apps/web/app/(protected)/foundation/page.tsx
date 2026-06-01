import { SmokeJobPanel } from "@/features/foundation/smoke/smoke-job-panel";

export default function ProtectedFoundationPage() {
  return (
    <section>
      <h1>Foundation Operations</h1>
      <p>Authenticated foundation shell for Admin validation.</p>
      <SmokeJobPanel />
    </section>
  );
}
