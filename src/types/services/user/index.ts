export type APIUserResponseWithoutData = {
  errorOccurred: boolean;
  errorMessage: string;
};

export interface APIUserResponseWithData extends APIUserResponseWithoutData {
  data: TokenData | null;
}

export type APIUserRequestInfo = Record<string, string>;

export type UpdatePasswordRequestInfo = {
  password?: string;
  token: string;
};

export interface PasswordResetRequestResponse
  extends APIUserResponseWithoutData {
  timeBeforeTokenExp: string | null;
}

export type TokenData = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
};

export type ServiceRedirectUrl = {
  serviceUrl: string;
};
