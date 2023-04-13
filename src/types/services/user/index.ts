export type CreateUserResult = {
  errorOccurred: boolean;
  errorMessage: string;
};

export type FormSubmitResult = {
  errorOccurred: boolean;
  errorMessage: string;
};

export type PasswordResetRequestInfo = Record<string, string>;

export type UpdatePasswordRequestInfo = {
  password?: string;
  token: string;
};

export type UpdateProfileInfo = Record<string, string>;

export interface PasswordResetRequestResponse extends FormSubmitResult {
  timeBeforeTokenExp: string | null;
}

export interface UpdatePasswordRequestResponse extends FormSubmitResult {}

export interface UpdateProfileInfoResponse extends FormSubmitResult {}

export type TokenData = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
};

export type SSOResponse = {
  serviceUrl: string;
};
