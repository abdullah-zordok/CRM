import Link from "next/link";

interface AccountUnavailableStateProps {
  title: string;
  description: string;
}

export function AccountUnavailableState({ title, description }: AccountUnavailableStateProps) {
  return (
    <main className="auth-shell" id="main-content">
      <section className="auth-panel" aria-labelledby="account-unavailable-title">
        <p className="eyebrow">Account access</p>
        <h1 id="account-unavailable-title">{title}</h1>
        <p>{description}</p>
        <p className="muted-text">
          This screen is an entry-only placeholder. It does not create users, issue reset tokens, or
          change account state.
        </p>
        <div className="button-row">
          <Link className="button button--primary" href="/login">
            Back to sign in
          </Link>
          <Link className="button button--secondary" href="/contact">
            Contact Sales
          </Link>
        </div>
      </section>
    </main>
  );
}
