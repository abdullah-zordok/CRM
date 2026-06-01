import Link from "next/link";
import { LoginForm } from "../../features/foundation/auth/login-form";

export default function LoginPage() {
  return (
    <main className="auth-shell" id="main-content">
      <section className="auth-panel" aria-labelledby="sign-in-title">
        <p className="eyebrow">Protected workspace</p>
        <h1 id="sign-in-title">Sign in</h1>
        <p>Use an authorized CRM account to enter the protected sales operations workspace.</p>
        <LoginForm />
        <div className="auth-links" aria-label="Account entry links">
          <Link href="/register">Register</Link>
          <Link href="/forgot-password">Forgot password</Link>
          <Link href="/reset-password">Reset password</Link>
        </div>
      </section>
    </main>
  );
}
