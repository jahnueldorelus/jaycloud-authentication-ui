import { isApiMessage } from "@app-types/services/iframe/api";
import {
  isEnterFullscreenMessage,
  isExitFullscreenMessage,
} from "@app-types/services/iframe/fullscreen";

// Default iframe message request
export type IframeMessageContent<A, P> = {
  action: A;
  payload: P;
};

export const messageEventData = {
  isApiMessage,
  isEnterFullscreenMessage,
  isExitFullscreenMessage,
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
