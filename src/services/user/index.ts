import {
  ApiAuthTokenResponse,
  RequestRefreshTokenData,
} from "@app-types/services/axios-interceptors";
import {
  APIUserResponseWithData,
  APIUserResponseWithoutData,
  PasswordResetRequestResponse,
  APIUserRequestInfo,
  ServiceRedirectUrl,
  TokenData,
  UpdatePasswordRequestInfo,
} from "@app-types/services/user";
import { uiRoutes } from "@components/navbar/routes";
import { apiService } from "@services/api";
import { localStorageService } from "@services/local-storage";
import { isAxiosError } from "axios";

export class UserService {
  private accessToken: string | null;
  private ssoToken: string | null;

  constructor() {
    this.accessToken = "";
    this.ssoToken = "";
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
   * Retrieves the user's sso token.
   */
  get userSSOToken() {
    return this.ssoToken;
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
   * Attempts to create a new user.
   * @param requestBody The data to send with the request
   */
  async createUser(requestBody: object): Promise<APIUserResponseWithData> {
    const result = await apiService.request(
      apiService.routes.post.users.create,
      {
        data: requestBody,
        method: "POST",
        withCredentials: true,
      }
    );

    // If a response was returned
    if (!isAxiosError(result)) {
      this.accessToken = result.headers["x-acc-token"] || "";
      this.userRefreshToken = result.headers["x-ref-token"] || "";

      return {
        data: result.data,
        errorMessage: "",
        errorOccurred: false,
      };
    }
    // If an error occurred
    else {
      const errorMessage: string = result.response ? result.response.data : "";

      return {
        data: null,
        errorMessage,
        errorOccurred: true,
      };
    }
  }

  /**
   * Attempts to authenticate a user.
   * @param requestBody The data to send with the request
   */
  async authenticateUser(
    requestBody: object
  ): Promise<APIUserResponseWithData> {
    const result = await apiService.request(
      apiService.routes.post.users.authenticate,
      {
        data: requestBody,
        method: "POST",
        withCredentials: true,
      }
    );

    // If a response was returned
    if (!isAxiosError(result)) {
      this.accessToken = result.headers["x-acc-token"] || "";
      this.userRefreshToken = result.headers["x-ref-token"] || "";

      return {
        data: result.data,
        errorMessage: "",
        errorOccurred: false,
      };
    }
    // If an error occurred
    else {
      const errorMessage: string = result.response ? result.response.data : "";

      return {
        data: null,
        errorMessage,
        errorOccurred: true,
      };
    }
  }

  /**
   * Attempts to do an SSO redirect back to the previous service
   * the user may have came from to authenticate.
   */
  async redirectToPreviousService() {
    const result = await apiService.request(
      apiService.routes.post.users.ssoRedirect,
      { method: "POST", withCredentials: true }
    );
    if (isAxiosError(result)) {
      location.replace(location.origin + uiRoutes.ssoFailed);
    } else {
      const data = <ServiceRedirectUrl>result.data;

      if (data.serviceUrl) {
        location.replace(data.serviceUrl);
      }
    }
  }

  /**
   * Attempts to retrieve the user's SSO token.
   */
  async getSSOToken(): Promise<void> {
    try {
      const response = await apiService.request(
        apiService.routes.post.users.ssoToken,
        {
          method: "GET",
          withCredentials: true,
        }
      );

      if (!isAxiosError(response)) {
        this.ssoToken = <string>response.data;
      } else {
        throw Error();
      }
    } catch (error: any) {
      this.ssoToken = null;
      this.userRefreshToken = null;
      this.accessToken = null;
    }
  }

  /**
   * Attemps to retrieve a new access and refresh tokens if a refresh token
   * is available.
   */
  async getUserReauthorized(): Promise<TokenData | null> {
    // Retrieves the user's SSO token to authrorize retrieving a new refresh token
    await this.getSSOToken();

    try {
      const requestData: RequestRefreshTokenData = {
        refreshToken: this.userRefreshToken || "",
      };

      const response = await apiService.request(
        apiService.routes.post.users.newRefreshToken,
        {
          method: "POST",
          data: requestData,
          withCredentials: true,
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

        return <TokenData>response.data;
      } else {
        localStorageService.removeRefreshToken();
        this.ssoToken = null;
        throw Error();
      }
    } catch (error: any) {
      return null;
    }
  }

  /**
   * Attempts to reset a user's password.
   * @param requestInfo The info to attach to the api request
   */
  async resetPassword(
    requestInfo: APIUserRequestInfo
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

      return {
        errorMessage,
        errorOccurred: true,
        timeBeforeTokenExp: null,
      };
    } else {
      return {
        errorMessage: "",
        errorOccurred: false,
        timeBeforeTokenExp: result.data,
      };
    }
  }

  /**
   * Attempts to update a user's password.
   * @param requestInfo The info to attach to the api request
   */
  async updatePassword(
    requestInfo: UpdatePasswordRequestInfo
  ): Promise<APIUserResponseWithoutData> {
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

      return {
        errorMessage,
        errorOccurred: true,
      };
    } else {
      return {
        errorMessage: "",
        errorOccurred: false,
      };
    }
  }

  /**
   * Attempts to update a user's profile info.
   * @param requestInfo The info to attach to the api request
   */
  async updateProfile(
    requestInfo: APIUserRequestInfo
  ): Promise<APIUserResponseWithData> {
    const result = await apiService.request(
      apiService.routes.post.users.update,
      {
        method: "POST",
        data: requestInfo,
      }
    );

    if (isAxiosError(result) || !result.data) {
      return {
        data: null,
        errorMessage: "Failed to update profile info",
        errorOccurred: true,
      };
    } else {
      this.accessToken = result.headers["x-acc-token"] || "";

      return {
        data: <TokenData>result.data,
        errorMessage: "",
        errorOccurred: false,
      };
    }
  }

  /**
   * Logs out the user.
   */
  async logoutUser() {
    const requestData: RequestRefreshTokenData = {
      refreshToken: this.userRefreshToken || "",
    };

    const response = await apiService.request(
      apiService.routes.post.users.signOut,
      {
        method: "POST",
        data: requestData,
        withCredentials: true,
      }
    );

    if (!isAxiosError(response)) {
      this.accessToken = null;
      this.userRefreshToken = null;

      return true;
    } else {
      return false;
    }
  }

  /**
   * Redirects the user who logged out back to the previous
   * JayCloud service they were on (only if they logged out through
   * a JayCloud service and not the authentication ui).
   */
  async loggedOutUserSSORedirect() {
    const response = await apiService.request(
      apiService.routes.post.users.ssoSignOut,
      {
        method: "POST",
        withCredentials: true,
      }
    );

    if (!isAxiosError(response)) {
      const jayCloudAppUrlRedirect = <string>response.data;

      if (!!jayCloudAppUrlRedirect) {
        location.replace(jayCloudAppUrlRedirect);
      }
    }
  }
}

export const userService = new UserService();
