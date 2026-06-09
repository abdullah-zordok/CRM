"use client";

import { useEffect, useState } from "react";
import {
  searchActivities,
  type ActivityListResponse,
  type ActivitySearchQuery,
  type ActivitySummary,
} from "../api/activities-client";

export function useActivities(query: ActivitySearchQuery) {
  const [items, setItems] = useState<ActivitySummary[]>([]);
  const [meta, setMeta] = useState<Omit<ActivityListResponse, "items">>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    searchActivities(query)
      .then((result) => {
        setItems(result.items);
        setMeta({
          total: result.total,
          page: result.page,
          pageSize: result.pageSize,
          correlationId: result.correlationId,
        });
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Unable to load activities."),
      )
      .finally(() => setLoading(false));
  }, [JSON.stringify(query)]);

  return { items, meta, loading, error };
}
