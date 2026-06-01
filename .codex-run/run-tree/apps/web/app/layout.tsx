import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Sales Operations CRM",
  description: "Foundation shell for secure CRM operations.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
