import { AccountUnavailableState } from "../../features/foundation/auth/account-unavailable-state";

export default function ForgotPasswordPage() {
  return (
    <AccountUnavailableState
      title="Password recovery is not available yet"
      description="Password recovery will be specified in a later account lifecycle feature."
    />
  );
}
