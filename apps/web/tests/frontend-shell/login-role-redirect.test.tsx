import React from "react";
import { fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LoginForm } from "../../features/foundation/auth/login-form";
import { renderWithProviders } from "../support/render";

const mocks = vi.hoisted(() => ({
  currentUser: vi.fn(),
  login: vi.fn(),
  push: vi.fn(),
  refresh: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mocks.push, refresh: mocks.refresh }),
}));

vi.mock("../../features/foundation/auth/auth-client", () => ({
  currentUser: mocks.currentUser,
  login: mocks.login,
}));

describe("LoginForm role redirects", () => {
  beforeEach(() => {
    mocks.currentUser.mockReset();
    mocks.login.mockReset();
    mocks.push.mockReset();
    mocks.refresh.mockReset();
    mocks.login.mockResolvedValue(undefined);
  });

  it("redirects Sales Representatives to the sales portal", async () => {
    mocks.currentUser.mockResolvedValue({
      id: "rep-1",
      email: "rep@example.com",
      displayName: "Rep",
      roles: ["SALES_REPRESENTATIVE"],
      hasReviewerAccess: false,
    });

    const { getByLabelText, getByRole } = renderWithProviders(<LoginForm />);
    fireEvent.change(getByLabelText("Email"), { target: { value: "rep@example.com" } });
    fireEvent.change(getByLabelText("Password"), { target: { value: "LongEnough123" } });
    fireEvent.click(getByRole("button", { name: "Sign in" }));

    await waitFor(() => expect(mocks.push).toHaveBeenCalledWith("/sales/leads"));
  });

  it("redirects Admins and Managers to the dashboard", async () => {
    mocks.currentUser.mockResolvedValue({
      id: "admin-1",
      email: "admin@example.com",
      displayName: "Admin",
      roles: ["ADMIN"],
      hasReviewerAccess: false,
    });

    const { getByLabelText, getByRole } = renderWithProviders(<LoginForm />);
    fireEvent.change(getByLabelText("Email"), { target: { value: "admin@example.com" } });
    fireEvent.change(getByLabelText("Password"), { target: { value: "LongEnough123" } });
    fireEvent.click(getByRole("button", { name: "Sign in" }));

    await waitFor(() => expect(mocks.push).toHaveBeenCalledWith("/dashboard"));
  });
});
