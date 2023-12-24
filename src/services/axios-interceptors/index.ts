import axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from "axios";
import { apiService } from "@services/api";
import { userService } from "@services/user";
import { UserConsumerMethods } from "@app-types/context/user";

class AxiosInterceptorsService {
  private retriedAuthRenewal = false;
  private userMethods: UserConsumerMethods;

  constructor(userConsumerMethods: UserConsumerMethods) {
    this.retriedAuthRenewal = false;
    this.setupRequestInterceptors();
    this.setupResponseInterceptors();
    this.userMethods = userConsumerMethods;
  }

  /**
   * Attempts to retrieve the user's refresh and access tokens.
   * @param originalRequest The original request that failed due to authentication
   * @returns A promise that resolves with the original request's response or an error
   */
  private async retrieveNewTokens(originalRequest: AxiosRequestConfig) {
    const userIsReauthorized = await this.userMethods.reauthorizeUser();

    if (userIsReauthorized) {
      /**
       * Does a redo of the original request that failed due
       * to it not being unauthorized
       */
      return axios(originalRequest);
    } else {
      throw Error("Failed to authenticate user.");
    }
  }

  /**
   * Handles authentication for a user if they're signed in.
   */
  private setupRequestInterceptors() {
    axios.interceptors.request.use(
      async (request) => {
        // If the original url isn't to sign in or refresh the user's tokens
        if (
          request.url !== apiService.routes.post.users.authenticate &&
          request.url !== apiService.routes.post.users.newRefreshToken
        ) {
          // The user's access token
          const userAccessToken = userService.userAccessToken;

          // The user's refresh token
          const userRefreshToken = userService.userRefreshToken;

          // Adds the user's access token if they're signed in
          if (userAccessToken && userRefreshToken) {
            request.headers.setAccept("application/json");
            request.headers.setAuthorization(`Bearer ${userAccessToken}`);
            request.headers.setContentType("application/json");
          }
        }
        return request;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  /**
   * Handles expired authentication errors
   */
  private setupResponseInterceptors() {
    axios.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error: AxiosError) => {
        /**
         * If the original url wasn't to sign in or refresh the user's tokens
         *   AND
         * if the user's access token has expired and a retry hasn't been
         * made of the request. The retry authentication is checked to prevent
         * an infinite loop if the request continously fail.
         */
        if (
          error.config &&
          error.config.url !== apiService.routes.post.users.authenticate &&
          error.config.url !== apiService.routes.post.users.newRefreshToken &&
          error.response &&
          error.response.status === 401 /* Unauthorized */ &&
          !this.retriedAuthRenewal &&
          error.message.toLowerCase().includes("token")
        ) {
          // Saves that an auth request was attempted
          this.retriedAuthRenewal = true;
          try {
            await this.retrieveNewTokens(error.config);
          } catch (error) {
            return Promise.reject(error);
          }

          // Resets the auth request retry
          this.retriedAuthRenewal = false;
          return Promise.resolve();
        } else {
          return Promise.reject(error);
        }
      }
    );
  }
}

let axiosInterceptorsService: AxiosInterceptorsService | null = null;

export const setupAxiosInterceptors = (
  userConsumerMethods: UserConsumerMethods
) => {
  if (!axiosInterceptorsService) {
    axiosInterceptorsService = new AxiosInterceptorsService(
      userConsumerMethods
    );
  }
};
