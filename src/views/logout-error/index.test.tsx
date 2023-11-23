import { LogoutError } from "@views/logout-error";
import { render } from "@testing-library/react";
import { testDataIds } from "@tests/helper";

describe("Logout Error", () => {
  const logoutErrorJSX = <LogoutError />;

  const mocks = vi.hoisted(() => ({
    useLocation: vi.fn(),
    navLink: vi.fn(),
  }));

  beforeEach(() => {
    // React Router Dom Mock
    vi.mock("react-router-dom", () => ({
      useLocation: mocks.useLocation,
      NavLink: mocks.navLink,
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("Should display app error", async () => {
    const { getByTestId } = render(logoutErrorJSX);
    const errorCardElement = getByTestId(testDataIds.appError.card);

    expect(errorCardElement).toBeInTheDocument();
  });

  it("Should display app error as logout error", async () => {
    const { getByTestId } = render(logoutErrorJSX);
    const errorTitleElement = getByTestId(testDataIds.appError.title);

    expect(errorTitleElement.textContent).toBe("Logout Error");
  });
});
