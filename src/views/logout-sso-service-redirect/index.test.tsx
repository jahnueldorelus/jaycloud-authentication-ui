import { LogoutSSOServiceRedirect } from "@views/logout-sso-service-redirect";
import { render, waitFor } from "@testing-library/react";
import { userService } from "@services/user";
import { SpyInstance } from "vitest";
import { uiRoutes } from "@components/navbar/routes";

describe("Logout Service SSO Redirect", () => {
  const logoutRedirectJSX = <LogoutSSOServiceRedirect />;

  const mockHelper = vi.hoisted(() => ({
    navigate: vi.fn(),
  }));

  const mocks = vi.hoisted(() => ({
    useNavigate: vi.fn(() => mockHelper.navigate),
    loggedOutUserSSORedirect: vi.fn() as SpyInstance<[], Promise<void>>,
  }));

  beforeEach(() => {
    // React Router Dom Mock
    vi.mock("react-router-dom", () => ({
      useNavigate: mocks.useNavigate,
    }));

    // Mocks API service call to redirect user after logging out
    mocks.loggedOutUserSSORedirect = vi
      .spyOn(userService, "loggedOutUserSSORedirect")
      .mockImplementation(async () => location.replace("test"));
  });

  afterEach(() => {
    vi.clearAllMocks();
    mocks.loggedOutUserSSORedirect.mockRestore();
  });

  it("Should redirect user to another service after logout", async () => {
    render(logoutRedirectJSX);

    await waitFor(() => {
      expect(mockHelper.navigate).not.toHaveBeenCalled();
    });
  });

  it("Should redirect user to login page after logout", async () => {
    mocks.loggedOutUserSSORedirect.mockImplementationOnce(async () => {});
    render(logoutRedirectJSX);

    await waitFor(() => {
      expect(mockHelper.navigate).toHaveBeenCalledWith(uiRoutes.login);
    });
  });
});
