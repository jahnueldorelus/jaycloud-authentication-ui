import { AxiosRequestConfig, Method } from "axios";

export type APIRoute = {
  any: { data: string };
  get: {
    newUserFormModel: string;
    authenticateUserFormModel: string;
    resetPasswordFormModel: string;
    updatePasswordFormModel: string;
    userProfileFormModel: string;
    services: {
      list: string;
      logo: string;
    };
  };
  post: {
    users: {
      create: string;
      authenticate: string;
      newRefreshToken: string;
      passwordReset: string;
      updatePassword: string;
      update: string;
    };
  };
};

export interface APIRequestConfig extends AxiosRequestConfig {
  method: Method;
}

export type DataRequest = {
  serviceId: string;
  apiPath: string;
  apiMethod: string;
};
