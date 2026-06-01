import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Sales Operations CRM",
  description: "Sales operations platform for lead tracking, visibility, and performance.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body>{children}</body>
    </html>
  );
}
