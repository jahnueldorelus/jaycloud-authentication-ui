import { AxiosResponse } from "axios";

// Interface for a user's refresh and access tokens inside of response header
export interface ApiAuthTokenResponse extends AxiosResponse {
  headers: {
    "x-acc-token": string;
    "x-ref-token": string;
  };
}

// A user's refresh token request
export type RequestRefreshTokenData = {
  refreshToken: string;
};
