import { Settings } from "lucide-react";
import { PlaceholderState } from "../../../features/workspace/components/placeholder-state";

export default function SettingsPage() {
  return (
    <PlaceholderState
      title="Settings"
      description="Workspace settings are not active in this phase and do not change accounts or system configuration."
      icon={Settings}
    />
  );
}
