import { APIRequestConfig, APIRoute } from "@app-types/services/api";
import axios, { AxiosError, AxiosResponse } from "axios";

class APIService {
  private baseApiPath = "http://localhost:61177/api";
  private baseApiUsersPath = "/users";
  private baseApiFormModelPath = this.baseApiUsersPath + "/form-models";
  private baseApiServicesPath = "/services";

  get routes(): APIRoute {
    return {
      get: {
        newUserFormModel: this.baseApiFormModelPath + "/create-user",
        authenticateUserFormModel:
          this.baseApiFormModelPath + "/authenticate-user",
        services: {
          list: this.baseApiServicesPath,
          logo: this.baseApiServicesPath + "/logo",
        },
      },
      post: {
        data: "/data",
        users: {
          create: this.baseApiUsersPath + "/new",
          authenticate: this.baseApiUsersPath,
          newRefreshToken: this.baseApiUsersPath + "/refreshToken",
          passwordReset: this.baseApiUsersPath + "/password-reset",
          updatePassword: this.baseApiUsersPath + "/update-password",
        },
      },
    };
  }

  async request(
    apiPath: string,
    config?: APIRequestConfig
  ): Promise<AxiosResponse<any, any> | AxiosError<any, any> | null> {
    try {
      return await axios(`${this.baseApiPath}${apiPath}`, config);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return error;
      }
      return null;
    }
  }
}

export const apiService = new APIService();
