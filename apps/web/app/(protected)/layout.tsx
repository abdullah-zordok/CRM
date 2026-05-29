import type { ReactNode } from "react";
import { LogoutButton } from "@/features/foundation/auth/logout-button";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <main style={{ padding: 32 }}>
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <strong>Protected Foundation Shell</strong>
        <LogoutButton />
      </header>
      {children}
    </main>
  );
}
