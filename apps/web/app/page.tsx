import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ padding: 32, maxWidth: 960 }}>
      <h1>Sales Operations CRM</h1>
      <p>Foundation shell for secure, spec-driven CRM delivery.</p>
      <Link href="/login">Sign in</Link>
    </main>
  );
}
