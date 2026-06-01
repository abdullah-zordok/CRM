import { AccountUnavailableState } from "../../features/foundation/auth/account-unavailable-state";

export default function ResetPasswordPage() {
  return (
    <AccountUnavailableState
      title="Password reset is not available yet"
      description="Reset links and password changes are intentionally out of scope for this phase."
    />
  );
}
