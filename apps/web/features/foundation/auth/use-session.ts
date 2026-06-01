"use client";

import { useEffect, useState } from "react";
import { currentUser, type CurrentUser } from "./auth-client";

export function useSession() {
  const [user, setUser] = useState<CurrentUser | null>();

  useEffect(() => {
    currentUser()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  return { user, loading: user === undefined };
}
