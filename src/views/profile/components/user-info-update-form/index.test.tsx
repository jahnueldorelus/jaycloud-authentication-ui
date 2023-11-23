import { SpyInstance } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { UserInfoUpdateForm } from "@views/profile/components/user-info-update-form";
import { FormModel } from "@app-types/form-model";
import { addUserProvider, domUser } from "@tests/helper";
import { userService } from "@services/user";
import {
  APIUserRequestInfo,
  APIUserResponseWithData,
  TokenData,
} from "@app-types/services/user";

describe("Profile - Update User Info Form", () => {
  /**
   * Mock variables and functions.
   */
  const mocks = vi.hoisted(() => ({
    tokenData: {
      createdAt: new Date().toString(),
      email: "user@email.com",
      firstName: "user-first",
      lastName: "user-last",
    } as TokenData,

    updateFormData: {
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

    updateProfile: vi.fn() as SpyInstance<
      [requestInfo: APIUserRequestInfo],
      Promise<APIUserResponseWithData>
    >,
  }));

  // JSX of the component to test
  const updateProfileJSX = addUserProvider(
    <UserInfoUpdateForm formInputs={mocks.updateFormData.inputs} />
  );

  /**
   * Sets up all mocks that will be used in every test.
   */
  beforeEach(() => {
    // Prevents API service from being called when submitting form
    mocks.updateProfile = vi
      .spyOn(userService, "updateProfile")
      .mockImplementation(
        async () =>
          ({
            data: mocks.tokenData,
            errorMessage: "",
            errorOccurred: false,
          } as APIUserResponseWithData)
      );
  });

  /**
   * Resets all mocks that were used in every test.
   */
  afterEach(() => {
    vi.clearAllMocks();
    mocks.updateProfile.mockRestore();
  });

  it("Should show that an update profile request failed", async () => {
    const errorMessage = "FAILED-TO-UPDATE-PROFILE";
    mocks.updateProfile.mockReturnValueOnce(
      Promise.resolve({
        data: null,
        errorMessage,
        errorOccurred: true,
      } as APIUserResponseWithData)
    );

    render(updateProfileJSX);

    let inputElement: HTMLInputElement = await screen.findByRole("textbox");
    await domUser.type(inputElement, "text");

    const submitButton = await screen.findByTestId("form-submit-button");
    await domUser.click(submitButton);

    await waitFor(async () => {
      const errorElement = await screen.findByTestId("form-alert-message");
      expect(errorElement.textContent).toBe(errorMessage);
    });
  });

  it("Should show that an update profile request passed", async () => {
    mocks.updateProfile.mockReturnValueOnce(
      Promise.resolve({
        data: mocks.tokenData,
        errorMessage: "",
        errorOccurred: false,
      } as APIUserResponseWithData)
    );

    render(updateProfileJSX);

    let inputElement: HTMLInputElement = await screen.findByRole("textbox");
    await domUser.type(inputElement, "text");

    const submitButton = await screen.findByTestId("form-submit-button");
    await domUser.click(submitButton);

    await waitFor(async () => {
      const errorElement = await screen.findByTestId("form-alert-message");
      expect(errorElement.textContent?.toLowerCase()).toContain(
        "successfully updated"
      );
    });
  });

  it("Should submit form when it's validated", async () => {
    render(updateProfileJSX);

    const inputElement: HTMLInputElement = await screen.findByRole("textbox");
    await domUser.type(inputElement, "email");

    const submitButton = await screen.findByTestId("form-submit-button");
    await domUser.click(submitButton);

    expect(mocks.updateProfile).toHaveBeenCalledTimes(1);
  });

  it("Shouldn't submit form when it's invalid", async () => {
    render(updateProfileJSX);

    const submitButton = await screen.findByTestId("form-submit-button");
    await domUser.click(submitButton);

    expect(mocks.updateProfile).toHaveBeenCalledTimes(0);
  });
});
