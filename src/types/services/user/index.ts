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
