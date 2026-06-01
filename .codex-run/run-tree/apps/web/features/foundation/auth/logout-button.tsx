"use client";

import { logout } from "@/features/foundation/auth/auth-client";

export function LogoutButton() {
  return (
    <button
      type="button"
      onClick={async () => {
        await logout();
        window.location.href = "/login";
      }}
    >
      Sign out
    </button>
  );
}
