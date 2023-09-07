import { formModelService } from "@services/form-model";
import { SpyInstance } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Register } from "@views/register";
import { FormModel } from "@app-types/form-model";
import { testDataIds, domUser } from "@tests/helper";
import { addUserProvider } from "@tests/helper";
import { userService } from "@services/user";
import { APIUserResponseWithData, TokenData } from "@app-types/services/user";
import { sessionStorageService } from "@services/session-storage";

describe("Register Form", () => {
  // JSX of the component to test
  const registerJSX = addUserProvider(<Register />);

  /**
   * Mock variables and functions.
   */
  const mockHelperFns = vi.hoisted(() => ({
    navigate: vi.fn(),
    useLocation: vi.fn(() => ({})),
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

    registerFormData: {
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

    getRegistrationForm: vi.fn() as SpyInstance<[], Promise<FormModel | null>>,

    createUser: vi.fn() as SpyInstance<
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
    mocks.getRegistrationForm = vi
      .spyOn(formModelService, "getRegistrationForm")
      .mockImplementation(async () => mocks.registerFormData);

    // Prevents API service from being called when submitting form
    mocks.createUser = vi.spyOn(userService, "createUser").mockImplementation(
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
    mocks.getRegistrationForm.mockRestore();
    mocks.createUser.mockRestore();
    mocks.redirectToPreviousService.mockRestore();
  });

  it("Should successfully fetch form and display it", async () => {
    render(registerJSX);

    await waitFor(() => {
      const registerForm = screen.getByTestId("register-form");
      expect(registerForm).toBeInTheDocument();
    });
  });

  it("Should fail to fetch form and display an error", async () => {
    mocks.getRegistrationForm.mockImplementationOnce(async () => null);
    render(registerJSX);

    await waitFor(() => {
      const uiErrorElement = screen.getByTestId(testDataIds.appUiError);
      expect(uiErrorElement).not.toBeNull();
    });
  });

  it("Should show loader while form is being fetched", async () => {
    render(registerJSX);

    await waitFor(() => {
      const appLoaderElement = screen.getByTestId(testDataIds.appLoader);
      expect(appLoaderElement).not.toBeNull();
    });
  });

  it("Should show that a register request failed", async () => {
    const errorMessage = "FAILED-TO-REGISTER";
    mocks.createUser.mockReturnValueOnce(
      Promise.resolve({
        data: null,
        errorMessage,
        errorOccurred: true,
      } as APIUserResponseWithData)
    );
    render(registerJSX);

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
    render(registerJSX);

    const inputElement: HTMLInputElement = await screen.findByRole("textbox");
    await domUser.type(inputElement, "email");

    const submitButton = await screen.findByTestId("form-submit-button");
    await domUser.click(submitButton);

    expect(mocks.createUser).toHaveBeenCalledTimes(1);
  });

  it("Shouldn't submit form when it's invalid", async () => {
    render(registerJSX);

    const submitButton = await screen.findByTestId("form-submit-button");
    await domUser.click(submitButton);

    expect(mocks.createUser).toHaveBeenCalledTimes(0);
  });

  describe("Views after successful login", () => {
    it("Should redirect the user to a service webpage", async () => {
      mockHelperFns.useSearchParamsGet.mockReturnValueOnce("true");
      render(registerJSX);

      // Successfully signs in
      const inputElement: HTMLInputElement = await screen.findByRole("textbox");
      await domUser.type(inputElement, "email");
      const submitButton = await screen.findByTestId("form-submit-button");
      await domUser.click(submitButton);

      expect(mocks.redirectToPreviousService).toHaveBeenCalled();
    });

    it("Should redirect the user to a view in the current application", async () => {
      render(registerJSX);

      // Successfully signs in
      const inputElement: HTMLInputElement = await screen.findByRole("textbox");
      await domUser.type(inputElement, "email");
      const submitButton = await screen.findByTestId("form-submit-button");
      await domUser.click(submitButton);

      expect(mocks.getViewBeforeAuth).toHaveBeenCalled();
    });
  });
});
