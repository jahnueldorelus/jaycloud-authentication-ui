import { formModelService } from "@services/form-model";
import { SpyInstance } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { FormModel } from "@app-types/form-model";
import { testDataIds, domUser, addUserProvider } from "@tests/helper";
import { userService } from "@services/user";
import {
  APIUserResponseWithoutData,
  TokenData,
  UpdatePasswordRequestInfo,
} from "@app-types/services/user";
import { UpdatePassword } from "@views/update-password";

describe("Update Password Form", () => {
  // JSX of the component to test
  const updatedPasswordJSX = addUserProvider(<UpdatePassword />);

  /**
   * Mock variables and functions.
   */
  const mockHelperFns = vi.hoisted(() => ({
    useSearchParamsGet: vi.fn(),
    navLink: vi.fn(),
  }));

  const mocks = vi.hoisted(() => ({
    tokenData: {
      createdAt: new Date().toString(),
      email: "user@email.com",
      firstName: "user-first",
      lastName: "user-last",
    } as TokenData,

    updatePasswordFormData: {
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

    getUpdatedPasswordForm: vi.fn() as SpyInstance<
      [],
      Promise<FormModel | null>
    >,

    updatePassword: vi.fn() as SpyInstance<
      [requestInfo: UpdatePasswordRequestInfo],
      Promise<APIUserResponseWithoutData>
    >,

    useSearchParams: vi.fn(() => [
      { get: mockHelperFns.useSearchParamsGet } as Partial<URLSearchParams>,
    ]),
  }));

  /**
   * Sets up all mocks that will be used in every test.
   */
  beforeEach(() => {
    // Prevents API service from being called when fetching form
    mocks.getUpdatedPasswordForm = vi
      .spyOn(formModelService, "getUpdatePasswordForm")
      .mockImplementation(async () => mocks.updatePasswordFormData);

    // Prevents API service from being called when submitting form
    mocks.updatePassword = vi
      .spyOn(userService, "updatePassword")
      .mockImplementation(
        async () =>
          ({
            errorMessage: "",
            errorOccurred: false,
          } as APIUserResponseWithoutData)
      );

    // React Router Dom Mock
    vi.mock("react-router-dom", () => ({
      useSearchParams: mocks.useSearchParams,
      NavLink: mockHelperFns.navLink,
    }));
  });

  /**
   * Resets all mocks that were used in every test.
   */
  afterEach(() => {
    vi.clearAllMocks();
    mocks.getUpdatedPasswordForm.mockRestore();
    mocks.updatePassword.mockRestore();
  });

  it("Should successfully fetch form and display it", async () => {
    render(updatedPasswordJSX);

    await waitFor(async () => {
      const updatedPasswordForm = await screen.findByTestId(
        "update-password-form"
      );
      expect(updatedPasswordForm).toBeInTheDocument();
    });
  });

  it("Should fail to fetch form and display an error", async () => {
    mocks.getUpdatedPasswordForm.mockImplementationOnce(async () => null);
    render(updatedPasswordJSX);

    await waitFor(() => {
      const uiErrorElement = screen.getByTestId(testDataIds.appUiError);
      expect(uiErrorElement).toBeInTheDocument();
    });
  });

  it("Should show loader while form is being fetched", async () => {
    render(updatedPasswordJSX);

    await waitFor(() => {
      const appLoaderElement = screen.getByTestId(testDataIds.appLoader);
      expect(appLoaderElement).toBeInTheDocument();
    });
  });

  it("Should show that an update password request failed", async () => {
    const errorMessage = "FAILED-TO-UPDATE-PASSWORD";
    mocks.updatePassword.mockReturnValueOnce(
      Promise.resolve({
        errorMessage,
        errorOccurred: true,
      } as APIUserResponseWithoutData)
    );
    render(updatedPasswordJSX);

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
    render(updatedPasswordJSX);

    const inputElement: HTMLInputElement = await screen.findByRole("textbox");
    await domUser.type(inputElement, "email");

    const submitButton = await screen.findByTestId("form-submit-button");
    await domUser.click(submitButton);

    expect(mocks.updatePassword).toHaveBeenCalledOnce();
  });

  it("Shouldn't submit form when it's invalid", async () => {
    render(updatedPasswordJSX);

    const submitButton = await screen.findByTestId("form-submit-button");
    await domUser.click(submitButton);

    expect(mocks.updatePassword).toHaveBeenCalledTimes(0);
  });
});
