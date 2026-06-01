import { CalendarClock } from "lucide-react";
import { PlaceholderState } from "../../../features/workspace/components/placeholder-state";

export default function ActivitiesPage() {
  return (
    <PlaceholderState
      title="Activities"
      description="Activity timelines and follow-up scheduling will be introduced by a later CRM capability."
      icon={CalendarClock}
    />
  );
}
