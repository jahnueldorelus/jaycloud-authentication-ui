import { userService } from "@services/user";
import { addUserProvider } from "@tests/helper";
import { Logout } from "@views/logout";
import { SpyInstance } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { uiRoutes } from "@components/navbar/routes";

describe("Logout", () => {
  const logoutJSX = addUserProvider(<Logout />);
  const mockHelper = vi.hoisted(() => ({
    navigate: vi.fn(),
  }));
  const mocks = vi.hoisted(() => ({
    useNavigate: vi.fn(() => mockHelper.navigate),
    signOutUser: vi.fn() as SpyInstance<[], Promise<boolean>>,
  }));

  beforeEach(() => {
    // Mocks the API call to logout a user
    mocks.signOutUser = vi
      .spyOn(userService, "logoutUser")
      .mockImplementation(async () => true);

    // React Router Dom Mock
    vi.mock("react-router-dom", () => ({
      useNavigate: mocks.useNavigate,
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
    mocks.signOutUser.mockRestore();
  });

  it("Should attempt to logout user", async () => {
    render(logoutJSX);

    await waitFor(() => {
      expect(mocks.signOutUser).toHaveBeenCalled();
    });
  });

  it("Should successfully logout user", async () => {
    render(logoutJSX);

    await waitFor(() => {
      expect(mockHelper.navigate).toHaveBeenCalledWith(
        uiRoutes.loggedOutUserSSORedirect
      );
    });
  });

  it("Should fail to logout user", async () => {
    mocks.signOutUser.mockReturnValueOnce(Promise.resolve(false));
    render(logoutJSX);

    await waitFor(() => {
      expect(mockHelper.navigate).toHaveBeenCalledWith(uiRoutes.logoutError);
    });
  });
});
