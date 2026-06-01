"use client";

import { useEffect, useState } from "react";
import { getSession, type CurrentUser } from "@/features/foundation/auth/auth-client";

export function useSession() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void getSession()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
}
