export const leadsQueryKeys = {
  all: ["leads"] as const,
  lists: () => [...leadsQueryKeys.all, "list"] as const,
  list: (query: Record<string, unknown>) => [...leadsQueryKeys.lists(), query] as const,
  detail: (leadId: string) => [...leadsQueryKeys.all, "detail", leadId] as const,
  sources: () => [...leadsQueryKeys.all, "sources"] as const,
};
