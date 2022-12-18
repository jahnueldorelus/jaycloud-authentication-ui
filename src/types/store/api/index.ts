// Interface for an api request
export interface APIMiddlewareRequest {
  // The URL to send the request to
  url: string;
  // The method of the request
  method: "get" | "post" | "put" | "delete";
  // The data to send with the request
  data?: number | string | object;
  // The headers of the request
  headers?: {
    Accept?: string;
    Authorization?: string;
    "Content-Type"?: string;
  };
  // The action to dispatch before sending the request
  onStart?: string;
  // The action to dispatch after sending the request
  onEnd?: string;
  // The action to dispatch when the request succeeds
  onSuccess?: string;
  // The action to dispatch when the request fails
  onError?: string;
  // Data to pass along with the response of the request
  passedData?: number | string | object | boolean;
}

// Interface for an API response
export interface APIMiddlewareResponse {
  // The response's data
  data: object | string | number;
  // Data passed along from the request to the response
  passedData: number | string | object | boolean;
  // Configuration data of the response
  config: object;
  // The status number of the response
  status: number;
  // The headers of the response
  headers: object;
}

// Interface for a user's refresh and access tokens inside of response header
export interface APIAuthTokenResponse extends APIMiddlewareResponse {
  headers: {
    "x-acc-token": string;
    "x-ref-token": string;
  };
}
