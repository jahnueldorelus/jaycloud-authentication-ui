import { FormModel } from "@app-types/form-model";
import { APIRequestConfig } from "@app-types/services/api";
import { apiService } from "@services/api";
import { AxiosError, AxiosResponse } from "axios";
import { SpyInstance } from "vitest";
import { formModelService } from ".";

describe("Service - Form Model", () => {
  // List of dummy services for testing
  const dummyForm: FormModel[] = [1, 2, 3].map((serviceId) => ({
    inputs: [],
    title: "dummy-form",
  }));

  const mocks = vi.hoisted(() => ({
    apiServiceRequestHelper: vi.fn(),
    apiServiceRequest: vi.fn() as SpyInstance<
      [apiPath: string, config?: APIRequestConfig | undefined],
      Promise<AxiosResponse<any, any> | AxiosError<any, any>>
    >,
  }));

  beforeEach(() => {
    // Mocks the API service request initiator
    mocks.apiServiceRequest = vi
      .spyOn(apiService, "request")
      .mockImplementation(mocks.apiServiceRequestHelper);
  });

  afterEach(() => {
    mocks.apiServiceRequest.mockRestore();
  });

  describe("Should succesfully fetch forms", () => {
    // Mock axios successful response for fetching a form
    const axiosSuccessResponseForm: AxiosResponse = <AxiosResponse>{
      data: dummyForm,
    };

    beforeEach(() => {
      mocks.apiServiceRequestHelper.mockReturnValue(
        Promise.resolve(axiosSuccessResponseForm)
      );
    });

    it("Registration form", async () => {
      const registrationForm = await formModelService.getRegistrationForm();
      expect(registrationForm).toBe(dummyForm);
    });

    it("Authentication form", async () => {
      const authenticationForm = await formModelService.getAuthenticationForm();
      expect(authenticationForm).toBe(dummyForm);
    });

    it("Profile update form", async () => {
      const profileUpdateForm = await formModelService.getProfileUpdateForm();
      expect(profileUpdateForm).toBe(dummyForm);
    });

    it("Forgot password form", async () => {
      const forgotPasswordForm = await formModelService.getForgotPasswordForm();
      expect(forgotPasswordForm).toBe(dummyForm);
    });

    it("Update password form", async () => {
      const updatePasswordForm = await formModelService.getUpdatePasswordForm();
      expect(updatePasswordForm).toBe(dummyForm);
    });
  });

  describe("Should fail to fetch forms", () => {
    beforeEach(() => {
      mocks.apiServiceRequestHelper.mockReturnValueOnce(Promise.resolve(null));
    });

    it("Registration form", async () => {
      const registrationForm = await formModelService.getRegistrationForm();
      expect(registrationForm).toBeNull();
    });

    it("Authentication form", async () => {
      const authenticationForm = await formModelService.getAuthenticationForm();
      expect(authenticationForm).toBeNull();
    });

    it("Profile update form", async () => {
      const profileUpdateForm = await formModelService.getProfileUpdateForm();
      expect(profileUpdateForm).toBeNull();
    });

    it("Forgot password form", async () => {
      const forgotPasswordForm = await formModelService.getForgotPasswordForm();
      expect(forgotPasswordForm).toBeNull();
    });

    it("Update password form", async () => {
      const updatePasswordForm = await formModelService.getUpdatePasswordForm();
      expect(updatePasswordForm).toBeNull();
    });
  });
});
