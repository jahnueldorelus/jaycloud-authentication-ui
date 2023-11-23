import { render } from "@testing-library/react";
import { vi } from "vitest";
import { ErrorPage } from "@views/error";

vi.mock("react-router-dom");

describe("App Error", () => {
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // Deprecated
        removeListener: vi.fn(), // Deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it("Should rended the app error view", () => {
    render(<ErrorPage />);
  });
});
