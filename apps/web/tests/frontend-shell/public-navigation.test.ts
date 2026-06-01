import { describe, expect, it } from "vitest";
import { publicNavigation } from "../../features/marketing/content/product-content";

describe("publicNavigation", () => {
  it("includes the required public product destinations", () => {
    expect(publicNavigation).toEqual([
      { href: "/", label: "Home" },
      { href: "/features", label: "Features" },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ]);
  });
});
