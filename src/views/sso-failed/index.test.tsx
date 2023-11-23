import { render, screen, waitFor } from "@testing-library/react";
import { SpyInstance } from "vitest";
import { SSOFailed } from "@views/sso-failed";
import { domUser } from "@tests/helper";

describe("SSO Failed", () => {
  const ssoFailedJSX = <SSOFailed />;

  const mocks = vi.hoisted(() => ({
    goBack: vi.fn(),
    history: vi.fn() as SpyInstance<[], void>,
  }));

  beforeEach(() => {
    mocks.history = vi.spyOn(history, "back").mockImplementation(mocks.goBack);
  });

  afterEach(() => {
    mocks.history.mockRestore();
  });

  it("Should go back a page when the 'go back' button is clicked", async () => {
    render(ssoFailedJSX);

    await waitFor(async () => {
      const goBackButton = screen.getByTestId("back-button");
      await domUser.click(goBackButton);

      expect(mocks.goBack).toHaveBeenCalledOnce();
    });
  });
});
