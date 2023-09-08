import { formModelService } from "@services/form-model";
import { SpyInstance, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { ForgotPassword } from "@views/forgot-password";
import { FormModel } from "@app-types/form-model";
import { addUserProvider, testDataIds, domUser } from "@tests/helper";
import { userService } from "@services/user";
import {
  APIUserRequestInfo,
  PasswordResetRequestResponse,
  TokenData,
} from "@app-types/services/user";

describe("Forgot Password Form", () => {
  // JSX of the component to test
  const forgetPasswordJSX = addUserProvider(<ForgotPassword />);

  /**
   * Mock variables and functions.
   */
  const mockHelperFns = vi.hoisted(() => ({
    navigate: vi.fn(),
    useLocation: vi.fn(() => ({ key: "default" })),
    NavLink: vi.fn(),
  }));

  const mocks = vi.hoisted(() => ({
    forgottenPasswordFormData: {
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

    forgottenPasswordForm: vi.fn() as SpyInstance<
      [],
      Promise<FormModel | null>
    >,

    resetPassword: vi.fn() as SpyInstance<
      [requestInfo: APIUserRequestInfo],
      Promise<PasswordResetRequestResponse>
    >,

    reauthorizeUser: vi.fn() as SpyInstance<[], Promise<TokenData | null>>,

    useNavigate: vi.fn(() => mockHelperFns.navigate),
    useLocation: mockHelperFns.useLocation,
  }));

  /**
   * Sets up all mocks that will be used in every test.
   */
  beforeEach(() => {
    // Prevents API service from being called when fetching form
    mocks.forgottenPasswordForm = vi
      .spyOn(formModelService, "getForgotPasswordForm")
      .mockImplementation(async () => mocks.forgottenPasswordFormData);

    // Prevents API service from being called when submitting form
    mocks.resetPassword = vi
      .spyOn(userService, "resetPassword")
      .mockImplementation(
        async () =>
          ({
            errorOccurred: false,
            errorMessage: "",
            timeBeforeTokenExp: null,
          } as PasswordResetRequestResponse)
      );

    // Prevents API service from being called when attempting to reauthorize user
    mocks.reauthorizeUser = vi
      .spyOn(userService, "getUserReauthorized")
      .mockImplementation(async () => null);

    // React Router Dom Mock
    vi.mock("react-router-dom", () => ({
      useNavigate: mocks.useNavigate,
      useLocation: mocks.useLocation,
      NavLink: mockHelperFns.NavLink,
    }));
  });

  /**
   * Resets all mocks that were used in every test.
   */
  afterEach(() => {
    vi.clearAllMocks();
    mocks.forgottenPasswordForm.mockRestore();
    mocks.resetPassword.mockRestore();
    mocks.reauthorizeUser.mockRestore();
  });

  it("Should successfully fetch form and display it", async () => {
    render(forgetPasswordJSX);

    await waitFor(() => {
      const formTitle = screen.getByTestId("form-title");
      expect(formTitle.textContent).toBe(mocks.forgottenPasswordFormData.title);
    });
  });

  it("Should fail to fetch form and display an error", async () => {
    mocks.forgottenPasswordForm.mockImplementationOnce(async () => null);
    render(forgetPasswordJSX);

    await waitFor(() => {
      const uiErrorElement = screen.getByTestId(testDataIds.appUiError);
      expect(uiErrorElement).toBeInTheDocument();
    });
  });

  it("Should show loader while form is being fetched", async () => {
    render(forgetPasswordJSX);

    await waitFor(() => {
      const appLoaderElement = screen.getByTestId(testDataIds.appLoader);
      expect(appLoaderElement).toBeInTheDocument();
    });
  });

  it("Should show that a password reset request submission failed", async () => {
    const errorMessage = "FAILED-TO-RESET";
    mocks.resetPassword.mockImplementationOnce(
      async () =>
        ({
          errorMessage: errorMessage,
          errorOccurred: true,
          timeBeforeTokenExp: null,
        } as PasswordResetRequestResponse)
    );
    render(forgetPasswordJSX);

    // Simulates the user type in an input and submitting the form
    const inputElement: HTMLInputElement = await screen.findByRole("textbox");
    await domUser.type(inputElement, "email");
    const submitButton = await screen.findByTestId("form-submit-button");
    await domUser.click(submitButton);

    await waitFor(async () => {
      const errorMessageElement = screen.getByTestId("form-error-message");
      expect(errorMessageElement).toBeInTheDocument();
      expect(errorMessageElement.textContent).toBe(errorMessage);
    });
  });

  it("Should submit form when it's validated", async () => {
    render(forgetPasswordJSX);

    const inputElement: HTMLInputElement = await screen.findByRole("textbox");
    await domUser.type(inputElement, "email");

    const submitButton = await screen.findByTestId("form-submit-button");
    await domUser.click(submitButton);

    expect(mocks.resetPassword).toHaveBeenCalledTimes(1);
  });

  it("Shouldn't submit form when it's invalid", async () => {
    render(forgetPasswordJSX);

    const submitButton = await screen.findByTestId("form-submit-button");
    await domUser.click(submitButton);

    expect(mocks.resetPassword).toHaveBeenCalledTimes(0);
  });

  it("Shouldn't allow user to 'go back' a page on first app render", async () => {
    render(forgetPasswordJSX);

    const goBackButton = await screen.findByTestId("form-go-back-button");
    await domUser.click(goBackButton);

    expect(mockHelperFns.navigate).toBeCalledTimes(0);
  });
});
