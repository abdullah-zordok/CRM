import React from "react";
import { describe, expect, it } from "vitest";
import { AccountUnavailableState } from "../../features/foundation/auth/account-unavailable-state";
import { renderWithProviders } from "../support/render";

describe("AccountUnavailableState", () => {
  it("states that account lifecycle actions are unavailable", () => {
    const { container } = renderWithProviders(
      <AccountUnavailableState
        title="Registration is not available yet"
        description="New account creation remains controlled."
      />,
    );

    expect(container.textContent).toContain("Registration is not available yet");
    expect(container.textContent).toContain("does not create users");
    expect(container.querySelector('a[href="/login"]')?.textContent).toContain("Back to sign in");
  });
});
