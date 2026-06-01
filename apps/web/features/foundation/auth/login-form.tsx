"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "./auth-client";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string>();

  async function submit(formData: FormData) {
    setError(undefined);
    try {
      await login({
        email: String(formData.get("email")),
        password: String(formData.get("password")),
      });
      router.push("/users");
      router.refresh();
    } catch {
      setError("Invalid email or password.");
    }
  }

  return (
    <form action={submit}>
      <label>
        Email
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label>
        Password
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          minLength={12}
          required
        />
      </label>
      <button type="submit">Sign in</button>
      {error ? <p role="alert">{error}</p> : null}
    </form>
  );
}
