// Default iframe message properties
type IframeMessageContent<A, D> = {
  action: A;
  payload: D;
};

// Api actions
type IframeMessageApiAction = "api";
type IframeMessageApiData = {
  method: "GET" | "PUT" | "POST" | "PATCH" | "DELETE";
  apiPath: string;
  data?: any;
};
export type IframeMessageApi = IframeMessageContent<
  IframeMessageApiAction,
  IframeMessageApiData
>;
/**
 * Determines if an iframe message event's data is an API message.
 * @param messageEvent The message event to check
 */
export const isApiMessage = (
  messageEvent: IframeMessageEventData
): messageEvent is IframeMessageApi => {
  const action: IframeMessageApiAction = "api";
  return messageEvent.action === action;
};

// Fullscreen actions
type IframeMessageFullscreenAction = "enter-fullscreen" | "exit-fullscreen";
export type IframeMessageFullscreen = IframeMessageContent<
  IframeMessageFullscreenAction,
  undefined
>;
/**
 * Determines if an iframe message event's data is to enter fullscreen message.
 * @param messageEvent The message event to check
 */
export const isEnterFullscreenMessage = (
  messageEvent: IframeMessageEventData
): messageEvent is IframeMessageApi => {
  const action: IframeMessageFullscreenAction = "enter-fullscreen";
  return messageEvent.action === action;
};
/**
 * Determines if an iframe message event's data is to exit fullscreen message.
 * @param messageEvent The message event to check
 */
export const isExitFullscreenMessage = (
  messageEvent: IframeMessageEventData
): messageEvent is IframeMessageApi => {
  const action: IframeMessageFullscreenAction = "exit-fullscreen";
  return messageEvent.action === action;
};

export const messageEventData = {
  isApiMessage,
  isEnterFullscreenMessage,
  isExitFullscreenMessage,
};
export type IframeMessageEventData = IframeMessageApi | IframeMessageFullscreen;
