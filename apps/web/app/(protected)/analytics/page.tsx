import { BarChart3 } from "lucide-react";
import { PlaceholderState } from "../../../features/workspace/components/placeholder-state";

export default function AnalyticsPage() {
  return (
    <PlaceholderState
      title="Analytics"
      description="Analytics will surface sales performance once the underlying CRM workflows are implemented."
      icon={BarChart3}
    />
  );
}
