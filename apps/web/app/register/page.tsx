import { AccountUnavailableState } from "../../features/foundation/auth/account-unavailable-state";

export default function RegisterPage() {
  return (
    <AccountUnavailableState
      title="Registration is not available yet"
      description="New account creation remains controlled by the CRM administration workflow."
    />
  );
}
