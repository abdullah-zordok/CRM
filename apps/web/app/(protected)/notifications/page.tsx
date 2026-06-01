import { Bell } from "lucide-react";
import { PlaceholderState } from "../../../features/workspace/components/placeholder-state";

export default function NotificationsPage() {
  return (
    <PlaceholderState
      title="Notifications"
      description="Notifications are reserved for a future operational messaging capability."
      icon={Bell}
    />
  );
}
