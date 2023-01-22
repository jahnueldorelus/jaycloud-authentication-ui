import { UserData } from "@app-types/entities";
import {
  CreateUserResult,
  FormSubmitResult,
  PasswordResetRequestInfo,
  PasswordResetRequestResponse,
  UpdatePasswordRequestInfo,
  UpdatePasswordRequestResponse,
} from "@app-types/services/user";
import { AuthAction } from "@app-types/store/auth";
import { apiService } from "@services/api";
import { localStorageService } from "@services/local-storage";
import { isAxiosError } from "axios";

export class UserService {
  private userAccessToken: string;

  constructor() {
    this.userAccessToken = "";
  }

  /**
   * Retrieves the user's access token.
   */
  get accessToken() {
    return this.userAccessToken;
  }

  /**
   * Attempts to create a new user.
   * @param requestBody The data to send with the request
   * @param authDispatch The authorization context dispatch for saving the user's info
   */
  async createUser(
    requestBody: object,
    authDispatch: React.Dispatch<AuthAction>
  ): Promise<CreateUserResult> {
    const result = await apiService.request(
      apiService.routes.post.users.create,
      {
        data: requestBody,
        method: "POST",
      }
    );

    // If a response was returned
    if (!isAxiosError(result)) {
      authDispatch({ type: "userAdded", payload: result.data });

      return {
        errorMessage: "",
        errorOccurred: false,
      };
    }
    // If an error occurred
    else {
      const errorMessage: string = result.response ? result.response.data : "";

      return {
        errorMessage,
        errorOccurred: true,
      };
    }
  }

  /**
   * Attempts to authenticate a user.
   * @param requestBody The data to send with the request
   * @param authDispatch The authorization context dispatch for saving the user's info
   */
  async authenticateUser(
    requestBody: object,
    authDispatch: React.Dispatch<AuthAction>
  ): Promise<FormSubmitResult> {
    const result = await apiService.request(
      apiService.routes.post.users.authenticate,
      {
        data: requestBody,
        method: "POST",
      }
    );

    // If a response was returned
    if (!isAxiosError(result)) {
      authDispatch({ type: "userAdded", payload: result.data });
      this.userAccessToken = result.headers["x-acc-token"] || "";
      localStorageService.setRefreshToken(result.headers["x-ref-token"] || "");

      return {
        errorMessage: "",
        errorOccurred: false,
      };
    }
    // If an error occurred
    else {
      const errorMessage: string = result.response ? result.response.data : "";

      return {
        errorMessage,
        errorOccurred: true,
      };
    }
  }

  /**
   * Attempts to reset a user's password.
   * @param requestInfo The info to attach to the api request
   */
  async resetPassword(
    requestInfo: PasswordResetRequestInfo
  ): Promise<PasswordResetRequestResponse> {
    const result = await apiService.request(
      apiService.routes.post.users.passwordReset,
      {
        method: "POST",
        data: requestInfo,
      }
    );

    if (isAxiosError(result) || !result.data) {
      const errorMessage: string =
        isAxiosError(result) && result.response ? result.response.data : "";
      const formSubmitResult: PasswordResetRequestResponse = {
        errorMessage,
        errorOccurred: true,
        timeBeforeTokenExp: null,
      };

      return formSubmitResult;
    } else {
      const formSubmitResult: PasswordResetRequestResponse = {
        errorMessage: "",
        errorOccurred: false,
        timeBeforeTokenExp: result.data,
      };

      return formSubmitResult;
    }
  }

  /**
   * Attempts to update a user's password.
   * @param requestInfo The info to attach to the api request
   */
  async updatePassword(
    requestInfo: UpdatePasswordRequestInfo
  ): Promise<UpdatePasswordRequestResponse> {
    const result = await apiService.request(
      apiService.routes.post.users.updatePassword,
      {
        method: "POST",
        data: requestInfo,
      }
    );

    if (isAxiosError(result) || !result.data) {
      const errorMessage: string =
        isAxiosError(result) && result.response ? result.response.data : "";
      const formSubmitResult: UpdatePasswordRequestResponse = {
        errorMessage,
        errorOccurred: true,
      };

      return formSubmitResult;
    } else {
      const formSubmitResult: UpdatePasswordRequestResponse = {
        errorMessage: "",
        errorOccurred: false,
      };

      return formSubmitResult;
    }
  }

  /**
   * Retrieves the full name of a user.
   * @param user The user to retrieve the full name from
   */
  getFullName(user: UserData | null) {
    if (user) {
      const firstName =
        user.firstName[0] &&
        user.firstName[0].toUpperCase() + user.firstName.slice(1);

      const lastName =
        user.lastName[0] &&
        user.lastName[0].toUpperCase() + user.lastName.slice(1);

      return `${firstName} ${lastName}`;
    } else {
      return "";
    }
  }
}

export const userService = new UserService();
