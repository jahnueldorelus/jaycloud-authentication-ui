import { FormModel } from "@app-types/form-model";
import { apiService } from "@services/api";
import { isAxiosError } from "axios";

class FormModelService {
  /**
   * Retrieves the new user registration form.
   */
  async getRegistrationForm(): Promise<FormModel | null> {
    const response = await apiService.request(
      apiService.routes.get.newUserFormModel,
      {
        method: "GET",
      }
    );

    if (!response || isAxiosError(response)) {
      return null;
    } else {
      return response.data;
    }
  }

  /**
   * Retrieves the user authentication form.
   */
  async getAuthenticationForm(): Promise<FormModel | null> {
    const response = await apiService.request(
      apiService.routes.get.authenticateUserFormModel,
      {
        method: "GET",
      }
    );

    if (!response || isAxiosError(response)) {
      return null;
    } else {
      return response.data;
    }
  }

  /**
   * Retrieves the user profile update form.
   */
  async getProfileUpdateForm(): Promise<FormModel | null> {
    const response = await apiService.request(
      apiService.routes.get.userProfileFormModel,
      {
        method: "GET",
      }
    );

    if (!response || isAxiosError(response)) {
      return null;
    } else {
      return response.data;
    }
  }

  /**
   * Retrieves the forgot password form.
   */
  async getForgotPasswordForm(): Promise<FormModel | null> {
    const response = await apiService.request(
      apiService.routes.get.resetPasswordFormModel,
      {
        method: "GET",
      }
    );

    if (!response || isAxiosError(response)) {
      return null;
    } else {
      return response.data;
    }
  }

  /**
   * Retrieves the update password form.
   */
  async getUpdatePasswordForm(): Promise<FormModel | null> {
    const response = await apiService.request(
      apiService.routes.get.updatePasswordFormModel,
      {
        method: "GET",
      }
    );

    if (!response || isAxiosError(response)) {
      return null;
    } else {
      return response.data;
    }
  }
}

export const formModelService = new FormModelService();
