import { AxiosRequestConfig, Method } from "axios";

export type APIRoute = {
  get: {
    newUserFormModel: string;
    authenticateUserFormModel: string;
    services: {
      list: string;
      logo: string;
    };
  };
  post: {
    data: string;
    users: {
      create: string;
      authenticate: string;
      newRefreshToken: string;
      passwordReset: string;
      updatePassword: string;
    };
  };
};

export interface APIRequestConfig extends AxiosRequestConfig {
  method: Method;
}
