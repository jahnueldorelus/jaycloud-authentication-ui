import { UserAction } from "@app-types/context/user";
import {
  ApiAuthTokenResponse,
  RequestRefreshTokenData,
} from "@app-types/services/axios-interceptors";
import {
  CreateUserResult,
  FormSubmitResult,
  PasswordResetRequestInfo,
  PasswordResetRequestResponse,
  TokenData,
  UpdatePasswordRequestInfo,
  UpdatePasswordRequestResponse,
  UpdateProfileInfo,
  UpdateProfileInfoResponse,
} from "@app-types/services/user";
import { apiService } from "@services/api";
import { localStorageService } from "@services/local-storage";
import { isAxiosError } from "axios";
import { Dispatch } from "react";

export class UserService {
  private accessToken: string | null;
  private userDispatch: Dispatch<UserAction> | null;

  constructor() {
    this.accessToken = "";
    this.userDispatch = null;
  }

  /**
   * Retrieves the user's access token.
   */
  get userAccessToken() {
    return this.accessToken;
  }

  /**
   * Retrieves the user's refresh token.
   */
  get userRefreshToken() {
    return localStorageService.getRefreshToken();
  }

  /**
   * Sets the user's refresh token
   */
  set userRefreshToken(token: string | null) {
    if (token) {
      localStorageService.setRefreshToken(token);
    } else {
      localStorageService.removeRefreshToken();
    }
  }

  /**
   * Determines if the user is logged in.
   */
  get userIsLoggedIn() {
    return Boolean(this.accessToken && this.userRefreshToken);
  }

  /**
   * Sets the user dispatch
   */
  set dispatch(userDispatch: Dispatch<UserAction>) {
    this.userDispatch = userDispatch;
  }

  /**
   * Dispatches the new info of the user.
   */
  updateUserInfo(userInfo: TokenData | null) {
    if (this.userDispatch) {
      this.userDispatch({ type: "setUser", payload: userInfo });
    }
  }

  /**
   * Attempts to create a new user.
   * @param requestBody The data to send with the request
   */
  async createUser(requestBody: object): Promise<CreateUserResult> {
    const result = await apiService.request(
      apiService.routes.post.users.create,
      {
        data: requestBody,
        method: "POST",
      }
    );

    // If a response was returned
    if (!isAxiosError(result)) {
      this.updateUserInfo(result.data);
      this.accessToken = result.headers["x-acc-token"] || "";
      this.userRefreshToken = result.headers["x-ref-token"] || "";

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
   */
  async authenticateUser(requestBody: object): Promise<FormSubmitResult> {
    const result = await apiService.request(
      apiService.routes.post.users.authenticate,
      {
        data: requestBody,
        method: "POST",
      }
    );

    // If a response was returned
    if (!isAxiosError(result)) {
      this.updateUserInfo(result.data);
      this.accessToken = result.headers["x-acc-token"] || "";
      this.userRefreshToken = result.headers["x-ref-token"] || "";

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
   * Attemps to retrieve a new access and refresh token if a refresh token
   * is available.
   */
  async getNewUserTokens(): Promise<boolean> {
    if (this.userRefreshToken) {
      try {
        const requestData: RequestRefreshTokenData = {
          token: this.userRefreshToken,
        };

        const response = await apiService.request(
          apiService.routes.post.users.newRefreshToken,
          {
            method: "POST",
            data: requestData,
          }
        );

        // Checks if a new access and refresh token was provided
        if (
          !isAxiosError(response) &&
          (<ApiAuthTokenResponse>response).headers["x-acc-token"] &&
          (<ApiAuthTokenResponse>response).headers["x-ref-token"]
        ) {
          this.accessToken = (<ApiAuthTokenResponse>response).headers[
            "x-acc-token"
          ];
          this.userRefreshToken = (<ApiAuthTokenResponse>response).headers[
            "x-ref-token"
          ];
          this.updateUserInfo(response.data);
          return Promise.resolve(true);
        } else {
          throw Error();
        }
      } catch (error: any) {
        return Promise.resolve(false);
      }
    } else {
      return Promise.resolve(false);
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
   * Attempts to update a user's profile info.
   * @param requestInfo The info to attach to the api request
   */
  async updateProfile(
    requestInfo: UpdateProfileInfo
  ): Promise<UpdateProfileInfoResponse> {
    const result = await apiService.request(
      apiService.routes.post.users.update,
      {
        method: "POST",
        data: requestInfo,
      }
    );

    if (isAxiosError(result) || !result.data) {
      const formSubmitResult: UpdateProfileInfoResponse = {
        errorMessage: "Failed to update profile info",
        errorOccurred: true,
      };

      return formSubmitResult;
    } else {
      this.updateUserInfo(result.data);
      this.accessToken = result.headers["x-acc-token"] || "";

      const formSubmitResult: UpdateProfileInfoResponse = {
        errorMessage: "",
        errorOccurred: false,
      };

      return formSubmitResult;
    }
  }

  /**
   * Retrieves the full name of a user.
   * @param user The user's info
   */
  getUserFullName(user: TokenData) {
    const firstName =
      user.firstName[0] &&
      user.firstName[0].toUpperCase() + user.firstName.slice(1);

    const lastName =
      user.lastName[0] &&
      user.lastName[0].toUpperCase() + user.lastName.slice(1);

    return `${firstName} ${lastName}`;
  }

  /**
   * Logs out the user.
   */
  logoutUser() {
    this.updateUserInfo(null);
    this.accessToken = null;
    this.userRefreshToken = null;
  }
}

export const userService = new UserService();
