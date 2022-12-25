import { AxiosError } from "axios";
import { APIAuthTokenResponse } from "../api";

// Interface of a user's data
export interface UserData {
  _id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

// Interface of a user's refresh token request
export interface ReqRefreshToken {
  token: string;
}

// Interface for the successful authentication of a user
export interface UserAuthSuccessResponse extends APIAuthTokenResponse {
  // The data returned is the user's data
  data: UserData;
}

// Interface for the failed authentication of a user
export interface UserAuthFailedResponse {
  error: AxiosError;
}

// Interface of the initial state
export interface EntitiesAuthSliceState {
  accessToken: string | null;
  tokensFetchFailed: boolean;
  requestLoading: boolean;
  requestFailedMessage: string | null;
  user: UserData | null;
}

export type AuthState = {
  accessToken: string | null;
  tokensFetchFailed: boolean;
  requestLoading: boolean;
  requestFailedMessage: string | null;
  user: UserData | null;
  dispatch: React.Dispatch<AuthAction>;
};

type StoreAction<T extends string, K> = { type: T; payload: K };
export type AuthAction =
  | StoreAction<"userAdded", any>
  | StoreAction<"refAndAccTokensAdded", any>
  | StoreAction<"requestFailed", any>
  | StoreAction<"resetRequestFailed", any>
  | StoreAction<"userRemoved", any>
  | StoreAction<"requestStarted", any>
  | StoreAction<"requestFinished", any>;

export type AuthProviderProps = {
  children: JSX.Element;
};
