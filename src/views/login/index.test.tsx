import { formModelService } from "@services/form-model";
import { SpyInstance } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Login } from "@views/login";
import { FormModel } from "@app-types/form-model";
import { testDataIds, domUser } from "@tests/helper";
import { addUserProvider } from "@tests/helper";
import { userService } from "@services/user";
import { APIUserResponseWithData, TokenData } from "@app-types/services/user";
import { sessionStorageService } from "@services/session-storage";

describe("Login Form", () => {
  // JSX of the component to test
  const loginJSX = addUserProvider(<Login />);

  /**
   * Mock variables and functions.
   */
  const mockHelperFns = vi.hoisted(() => ({
    navigate: vi.fn(),
    useLocation: vi.fn(() => ({ key: "default" })),
    useSearchParamsGet: vi.fn(),
    NavLink: vi.fn(),
  }));

  const mocks = vi.hoisted(() => ({
    tokenData: {
      createdAt: new Date().toString(),
      email: "user@email.com",
      firstName: "user-first",
      lastName: "user-last",
    } as TokenData,

    loginFormData: {
      title: "FORM-TITLE",
      inputs: [
        {
          label: "email",
          multiline: false,
          name: "email",
          requestBodyProperty: "email",
          type: "email",
          validation: {
            allowNull: true,
            max: 10,
            min: 0,
            regex: [],
            regexErrorLabel: "",
            required: false,
          },
        },
      ],
    } as FormModel,

    getAuthenticationForm: vi.fn() as SpyInstance<
      [],
      Promise<FormModel | null>
    >,

    authenticateUser: vi.fn() as SpyInstance<
      [requestBody: object],
      Promise<APIUserResponseWithData>
    >,

    redirectToPreviousService: vi.fn() as SpyInstance<[], Promise<void>>,

    getViewBeforeAuth: vi.fn(() => null),
    useNavigate: vi.fn(() => mockHelperFns.navigate),
    useLocation: mockHelperFns.useLocation,
    useSearchParams: vi.fn(() => [
      { get: mockHelperFns.useSearchParamsGet } as Partial<URLSearchParams>,
    ]),
  }));

  /**
   * Sets up all mocks that will be used in every test.
   */
  beforeEach(() => {
    // Prevents API service from being called when fetching form
    mocks.getAuthenticationForm = vi
      .spyOn(formModelService, "getAuthenticationForm")
      .mockImplementation(async () => mocks.loginFormData);

    // Prevents API service from being called when submitting form
    mocks.authenticateUser = vi
      .spyOn(userService, "authenticateUser")
      .mockImplementation(
        async () =>
          ({
            data: mocks.tokenData,
            errorMessage: "",
            errorOccurred: false,
          } as APIUserResponseWithData)
      );

    // Prevents webpage redirect after user logs in
    mocks.redirectToPreviousService = vi
      .spyOn(userService, "redirectToPreviousService")
      .mockImplementation(async () => {});

    // React Router Dom Mock
    vi.mock("react-router-dom", () => ({
      useNavigate: mocks.useNavigate,
      useLocation: mocks.useLocation,
      useSearchParams: mocks.useSearchParams,
      NavLink: mockHelperFns.NavLink,
    }));

    // Mocks the session storage service
    vi.mock("@services/session-storage", () => {
      return {
        sessionStorageService: {
          getViewBeforeAuth: mocks.getViewBeforeAuth,
        } as Partial<typeof sessionStorageService>,
      };
    });
  });

  /**
   * Resets all mocks that were used in every test.
   */
  afterEach(() => {
    vi.clearAllMocks();
    mocks.getAuthenticationForm.mockRestore();
    mocks.authenticateUser.mockRestore();
    mocks.redirectToPreviousService.mockRestore();
  });

  it("Should successfully fetch form and display it", async () => {
    render(loginJSX);

    await waitFor(() => {
      const loginForm = screen.getByTestId("login-form");
      expect(loginForm).toBeInTheDocument();
    });
  });

  it("Should fail to fetch form and display an error", async () => {
    mocks.getAuthenticationForm.mockImplementationOnce(async () => null);
    render(loginJSX);

    await waitFor(() => {
      const uiErrorElement = screen.getByTestId(testDataIds.appUiError);
      expect(uiErrorElement).toBeInTheDocument();
    });
  });

  it("Should show loader while form is being fetched", async () => {
    render(loginJSX);

    await waitFor(() => {
      const appLoaderElement = screen.getByTestId(testDataIds.appLoader);
      expect(appLoaderElement).toBeInTheDocument();
    });
  });

  it("Should show that a login request failed", async () => {
    const errorMessage = "FAILED-TO-LOGIN";
    mocks.authenticateUser.mockReturnValueOnce(
      Promise.resolve({
        data: null,
        errorMessage,
        errorOccurred: true,
      } as APIUserResponseWithData)
    );
    render(loginJSX);

    let inputElement: HTMLInputElement = await screen.findByRole("textbox");
    await domUser.type(inputElement, "text");

    const submitButton = await screen.findByTestId("form-submit-button");
    await domUser.click(submitButton);

    await waitFor(async () => {
      const errorElement = await screen.findByTestId("form-error-message");
      expect(errorElement.textContent).toBe(errorMessage);
    });
  });

  it("Should submit form when it's validated", async () => {
    render(loginJSX);

    const inputElement: HTMLInputElement = await screen.findByRole("textbox");
    await domUser.type(inputElement, "email");

    const submitButton = await screen.findByTestId("form-submit-button");
    await domUser.click(submitButton);

    expect(mocks.authenticateUser).toHaveBeenCalledTimes(1);
  });

  it("Shouldn't submit form when it's invalid", async () => {
    render(loginJSX);

    const submitButton = await screen.findByTestId("form-submit-button");
    await domUser.click(submitButton);

    expect(mocks.authenticateUser).toHaveBeenCalledTimes(0);
  });

  describe("Views after successful login", () => {
    it("Should redirect the user to a service webpage", async () => {
      mockHelperFns.useSearchParamsGet.mockReturnValueOnce("true");
      render(loginJSX);

      // Successfully signs in
      const inputElement: HTMLInputElement = await screen.findByRole("textbox");
      await domUser.type(inputElement, "email");
      const submitButton = await screen.findByTestId("form-submit-button");
      await domUser.click(submitButton);

      expect(mocks.redirectToPreviousService).toHaveBeenCalled();
    });

    it("Should redirect the user to a view in the current application", async () => {
      render(loginJSX);

      // Successfully signs in
      const inputElement: HTMLInputElement = await screen.findByRole("textbox");
      await domUser.type(inputElement, "email");
      const submitButton = await screen.findByTestId("form-submit-button");
      await domUser.click(submitButton);

      expect(mocks.getViewBeforeAuth).toHaveBeenCalled();
    });
  });
});
