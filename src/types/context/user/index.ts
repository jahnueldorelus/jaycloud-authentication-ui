import {
  APIUserRequestInfo,
  APIUserResponseWithData,
  UpdatePasswordRequestInfo,
  APIUserResponseWithoutData,
  PasswordResetRequestResponse,
  TokenData,
} from "@app-types/services/user";

export type UserConsumerState = {
  user: TokenData | null;
  authReqProcessing: boolean;
  reauthorizedUserAtLeastOnce: boolean;
};

export type UserConsumerMethods = {
  setUser: React.Dispatch<React.SetStateAction<TokenData | null>>;

  createNewUser: (
    requestData: APIUserRequestInfo
  ) => Promise<APIUserResponseWithData>;

  signInUser: (
    requestData: APIUserRequestInfo
  ) => Promise<APIUserResponseWithData>;

  signOutUser: () => Promise<boolean>;

  reauthorizeUser: () => Promise<boolean>;

  serviceRedirectAfterLogin: () => Promise<void>;

  serviceRedirectAfterLogout: () => Promise<void>;

  resetUserPassword: (
    requestData: APIUserRequestInfo
  ) => Promise<PasswordResetRequestResponse>;

  updateUserPassword: (
    requestData: UpdatePasswordRequestInfo
  ) => Promise<APIUserResponseWithoutData>;

  updateUserProfile: (
    requestData: APIUserRequestInfo
  ) => Promise<APIUserResponseWithData>;

  getUserFullName: (user: TokenData) => string;
};

export type UserConsumer = {
  state: UserConsumerState;
  methods: UserConsumerMethods;
};

export type UserProviderProps = {
  children: JSX.Element | JSX.Element[];
};
