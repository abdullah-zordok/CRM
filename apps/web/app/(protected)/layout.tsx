import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LogoutButton } from "../../features/foundation/auth/logout-button";

const API_BASE_URL =
  process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    cache: "no-store",
    headers: {
      cookie: cookieStore.toString(),
    },
  });

  if (!response.ok) {
    redirect("/login");
  }

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
