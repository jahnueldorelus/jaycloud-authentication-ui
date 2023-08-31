import { formModelService } from "@services/form-model";
import { SpyInstance, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ForgotPassword } from "@views/forgot-password";
import { FormModel } from "@app-types/form-model";
import { testDataIds } from "@tests/helper";
import { UserProvider } from "@context/user";
import { userService } from "@services/user";
import {
  APIUserRequestInfo,
  PasswordResetRequestResponse,
  TokenData,
} from "@app-types/services/user";

describe("Forgot Password Form", () => {
  // JSX of the component to test
  const forgetPasswordJSX = (
    <UserProvider>
      <ForgotPassword />
    </UserProvider>
  );

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
  });

  /**
   * Resets all mocks that were used in every test.
   */
  afterEach(() => {
    mocks.forgottenPasswordForm.mockRestore();
    mocks.resetPassword.mockRestore();
    mocks.reauthorizeUser.mockRestore();
    vi.clearAllMocks();
  });

  describe("Functionality", () => {
    beforeEach(() => {
      // React Router Dom Mock
      vi.mock("react-router-dom", () => ({
        useNavigate: mocks.useNavigate,
        useLocation: mocks.useLocation,
        NavLink: mockHelperFns.NavLink,
      }));
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it("Should successfully fetch form and display it", async () => {
      render(forgetPasswordJSX);

      await waitFor(() => {
        const formTitle = screen.getByTestId("form-title");
        expect(formTitle.textContent).toBe(
          mocks.forgottenPasswordFormData.title
        );
      });
    });

    it("Should fail to fetch form and display an error", async () => {
      mocks.forgottenPasswordForm.mockImplementationOnce(async () => null);
      render(forgetPasswordJSX);

      await waitFor(() => {
        const uiErrorElement = screen.getByTestId(testDataIds.appUiError);
        expect(uiErrorElement).not.toBeNull();
      });
    });

    it("Should show loader while form is being fetched", async () => {
      render(forgetPasswordJSX);

      await waitFor(() => {
        const appLoaderElement = screen.getByTestId(testDataIds.appLoader);
        expect(appLoaderElement).not.toBeNull();
      });
    });

    it("Should show that a password reset request submission failed", async () => {
      mocks.resetPassword.mockImplementationOnce(
        async () =>
          ({
            errorMessage: "fail",
            errorOccurred: true,
            timeBeforeTokenExp: null,
          } as PasswordResetRequestResponse)
      );
      render(forgetPasswordJSX);

      await waitFor(async () => {
        // Simulates the user type in an input and submitting the form
        const inputElement: HTMLInputElement = screen.getByRole("textbox");
        await userEvent.type(inputElement, "email");
        const submitButton = screen.getByTestId("form-submit-button");
        await userEvent.click(submitButton);

        const errorMessageElement = screen.getByTestId("form-error-message");
        expect(errorMessageElement).toBeInTheDocument();
      });
    });

    it("Should submit form when it's validated", async () => {
      render(forgetPasswordJSX);

      await waitFor(async () => {
        const inputElement: HTMLInputElement = screen.getByRole("textbox");
        await userEvent.type(inputElement, "email");

        const submitButton = screen.getByTestId("form-submit-button");
        fireEvent.click(submitButton);

        expect(mocks.resetPassword).toHaveBeenCalledTimes(1);
      });
    });

    it("Shouldn't submit form when it's invalid", async () => {
      render(forgetPasswordJSX);

      await waitFor(async () => {
        const submitButton = screen.getByTestId("form-submit-button");
        fireEvent.click(submitButton);

        expect(mocks.resetPassword).toHaveBeenCalledTimes(0);
      });
    });

    it("Shouldn't allow user to 'go back' a page on first app render", async () => {
      const { getByTestId } = render(forgetPasswordJSX);

      await waitFor(async () => {
        const goBackButton = getByTestId("form-go-back-button");
        await userEvent.click(goBackButton);

        expect(mockHelperFns.navigate).toBeCalledTimes(0);
      });
    });
  });
});
