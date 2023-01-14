import { IframeMessageContent } from "@app-types/services/iframe";

// Api actions
type IframeMessageApiAction = "api";
type IframeMessageApiPayload = {
  apiMethod: "GET" | "PUT" | "POST" | "PATCH" | "DELETE";
  apiPath: string;
  data?: any;
};

// Api request
export type IframeMessageApiRequest = IframeMessageContent<
  IframeMessageApiAction,
  IframeMessageApiPayload
>;

// Api response payload
export type IframeAPIResponsePayload = {
  apiPath: string;
  apiMethod: "GET" | "PUT" | "POST" | "PATCH" | "DELETE";
  error?: string;
  data?: any;
};

// Api response
export type IframeMessageApiResponse = IframeMessageContent<
  IframeMessageApiAction,
  IframeAPIResponsePayload
>;

/**
 * Determines if an iframe message event's data is an API message.
 * @param messageEvent The message event to check
 */
export const isApiMessage = (
  messageEvent: IframeMessageApiRequest
): messageEvent is IframeMessageApiRequest => {
  return messageEvent.action === "api";
};
