import { APIRequestConfig, APIRoute } from "@app-types/services/api";
import axios, { AxiosError, AxiosResponse } from "axios";

class APIService {
  private baseApiPath =
    // @ts-ignore
    import.meta.env.VITE_ENVIRONMENT === "production"
      ? // @ts-ignore
        import.meta.env.VITE_API_PROD_URL
      : // @ts-ignore
        import.meta.env.VITE_API_DEV_URL;
  private baseApiUsersPath = "/users";
  private baseApiFormModelPath = this.baseApiUsersPath + "/form-models";
  private baseApiServicesPath = "/services";
  private baseApiSSOPath = "/sso";

  get routes(): APIRoute {
    return {
      any: { data: "/data" },
      get: {
        newUserFormModel: this.baseApiFormModelPath + "/create-user",
        authenticateUserFormModel:
          this.baseApiFormModelPath + "/authenticate-user",
        resetPasswordFormModel: this.baseApiFormModelPath + "/password-reset",
        updatePasswordFormModel: this.baseApiFormModelPath + "/update-password",
        userProfileFormModel: this.baseApiFormModelPath + "/update-user",
        services: {
          list: this.baseApiServicesPath,
          logo: this.baseApiServicesPath + "/logo",
        },
      },
      post: {
        users: {
          create: this.baseApiUsersPath + "/new",
          authenticate: this.baseApiUsersPath,
          signOut: this.baseApiUsersPath + "/sign-out",
          newRefreshToken: this.baseApiUsersPath + "/refresh-token",
          passwordReset: this.baseApiUsersPath + "/password-reset",
          updatePassword: this.baseApiUsersPath + "/update-password",
          update: this.baseApiUsersPath + "/update",
          ssoSignedInServiceRedirect:
            this.baseApiSSOPath + "/sign-in-service-redirect",
          ssoSignedOutServiceRedirect:
            this.baseApiSSOPath + "/sign-out-service-redirect",
          ssoDecryptedCsrfToken: this.baseApiSSOPath + "/sso-token",
        },
      },
    };
  }

  async request(
    apiPath: string,
    config?: APIRequestConfig
  ): Promise<AxiosResponse<any, any> | AxiosError<any, any>> {
    try {
      return await axios(`${this.baseApiPath}${apiPath}`, config);
    } catch (error) {
      return <AxiosError<any, any>>error;
    }
  }
}

export const apiService = new APIService();
