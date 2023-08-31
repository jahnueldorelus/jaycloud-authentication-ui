import App from "./App";
import { render, fireEvent } from "@testing-library/react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { vi } from "vitest";

vi.mock("@components/navbar");

describe("App", () => {
  // The APP jsx with react router
  const appJSX = (
    <RouterProvider
      router={createBrowserRouter([
        { path: "/", element: <App /> },
      ])}
    />
  );

  beforeAll(() => {
    // Creates the window object method "scrollTo"
    Object.defineProperty(window, "scrollTo", {
      writable: true,
      value: vi.fn(),
    });
  });

  it("Should render app", () => {
    render(appJSX);
    });

  it("Should render the 'skip to main content' button for accessibility", () => {
    const { getByRole } = render(appJSX);
    const skipToContentButton = getByRole("button");
    expect(
      skipToContentButton.classList.contains("visually-hidden-focusable")
    ).toBe(true);
  });

  it("Should focus on the main content of the page", () => {
    const { getByRole, getByTestId } = render(appJSX);
    const skipToContentButton = getByRole("button");
    const topOfMainRef = getByTestId("top-of-main-ref");

    const mockFocusElement = vi.fn();
    topOfMainRef.focus = mockFocusElement;

    fireEvent.click(skipToContentButton);
    expect(mockFocusElement).toBeCalledTimes(1);
  });


});
