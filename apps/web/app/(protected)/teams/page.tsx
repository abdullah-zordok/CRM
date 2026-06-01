import { TeamManagement } from "../../../features/users/components/team-management";
import { TeamUserView } from "../../../features/users/components/team-user-view";

export default function TeamsPage() {
  return (
    <main>
      <TeamManagement />
      <TeamUserView />
    </main>
  );
}
