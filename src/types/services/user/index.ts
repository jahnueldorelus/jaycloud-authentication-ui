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

export interface PasswordResetRequestResponse extends FormSubmitResult {
  timeBeforeTokenExp: string | null;
}

export interface UpdatePasswordRequestResponse extends FormSubmitResult {}

export type TokenData = {
  _id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
};
