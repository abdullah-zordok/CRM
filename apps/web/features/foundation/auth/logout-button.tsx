"use client";

import { useRouter } from "next/navigation";
import { logout } from "./auth-client";

export function LogoutButton() {
  const router = useRouter();

  async function submit() {
    await logout();
    router.push("/login");
    router.refresh();
  }

  return (
    <button type="button" onClick={submit}>
      Sign out
    </button>
  );
}
