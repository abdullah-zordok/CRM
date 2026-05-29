import type { ReactNode } from "react";

export default function FoundationLayout({ children }: { children: ReactNode }) {
  return <section style={{ padding: 24 }}>{children}</section>;
}
