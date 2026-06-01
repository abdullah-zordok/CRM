import type { ReactNode } from "react";

interface AccessibilityFrameProps {
  children: ReactNode;
}

export function AccessibilityFrame({ children }: AccessibilityFrameProps) {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      {children}
    </>
  );
}
