import { LoginForm } from "../../features/foundation/auth/login-form";

export default function LoginPage() {
  return (
    <main style={{ padding: 32, maxWidth: 480 }}>
      <h1>Sign in</h1>
      <LoginForm />
    </main>
  );
}
