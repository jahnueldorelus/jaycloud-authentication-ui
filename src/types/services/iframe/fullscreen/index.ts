import { IframeMessageContent } from "@app-types/services/iframe";

// Fullscreen actions
type IframeMessageEnterFullscreenAction = "enter-fullscreen";
type IframeMessageExitFullscreenAction = "exit-fullscreen";
type IframeMessageFullscreenStatusAction = "fullscreen-mode";
type IframeMessageFullscreenAction =
  | IframeMessageEnterFullscreenAction
  | IframeMessageExitFullscreenAction
  | IframeMessageFullscreenStatusAction;

// Fullscreen request
type IframeMessageFullscreenRequest = IframeMessageContent<
  IframeMessageFullscreenAction,
  undefined
>;

// Fullscreen status response
export type IframeMessageFullscreenResponse = IframeMessageContent<
  IframeMessageFullscreenStatusAction,
  boolean
>;

/**
 * Determines if an iframe message event's data is to enter fullscreen message.
 * @param messageEvent The message event to check
 */
export const isEnterFullscreenMessage = (
  messageEvent: IframeMessageFullscreenRequest
): messageEvent is IframeMessageFullscreenRequest => {
  const action: IframeMessageEnterFullscreenAction = "enter-fullscreen";
  return messageEvent.action === action;
};

/**
 * Determines if an iframe message event's data is to exit fullscreen message.
 * @param messageEvent The message event to check
 */
export const isExitFullscreenMessage = (
  messageEvent: IframeMessageFullscreenRequest
): messageEvent is IframeMessageFullscreenRequest => {
  const action: IframeMessageExitFullscreenAction = "exit-fullscreen";
  return messageEvent.action === action;
};

// Allows for specific browser fullscreen methods to be available
export interface BrowserDocument extends Document {
  webkitExitFullscreen: any;
  msExitFullscreen: any;
  cancelFullScreen: any;
  mozCancelFullScreen: any;
  isFullScreen: any;
  webkitFullscreenElement: any;
  mozFullScreenElement: any;
  msFullscreenElement: any;
}
export interface BrowserDocumentElement extends HTMLElement {
  webkitRequestFullscreen: any;
  msRequestFullscreen: any;
  requestFullScreen: any;
  mozRequestFullScreen: any;
}
