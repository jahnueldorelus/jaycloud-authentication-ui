import { Service } from "@app-types/entities";
import {
  BrowserDocument,
  BrowserDocumentElement,
  messageEventData,
} from "@app-types/services/iframe";
import {
  IframeMessageApiResponse,
  IframeMessageApiRequest,
} from "@app-types/services/iframe/api";
import { IframeMessageFullscreenResponse } from "@app-types/services/iframe/fullscreen";
import { apiService } from "@services/api";
import { DataRequest } from "@app-types/services/api";
import { isAxiosError } from "axios";

export class IframeService {
  private iframe: HTMLIFrameElement;
  private iframeExitElement: HTMLElement | null;
  private service: Service;
  private serviceFullUrl: string;

  /**
   * @param iframeElement The iframe element the JayCloud service should load in
   * @param service The info of the service that will be loaded in the iframe
   * @param iframeExitElement The element that allows the user to exit the iframe
   */
  constructor(
    iframeElement: HTMLIFrameElement,
    service: Service,
    iframeExitElement: HTMLElement | null
  ) {
    this.iframe = iframeElement;
    this.iframeExitElement = iframeExitElement;
    this.service = service;
    this.serviceFullUrl = `${this.service.uiUrl}${
      this.service.uiPort ? ":" + this.service.uiPort : ""
    }`;

    this.setupReceivingMessages();
    this.addOnFullscreenChange();
  }

  private addOnFullscreenChange() {
    document.documentElement.onfullscreenchange = () => {
      const isInFullscreenMode = this.isDocInFullscreenMode();
      const responseMessage: IframeMessageFullscreenResponse = {
        action: "fullscreen-mode",
        payload: isInFullscreenMode,
      };

      this.postMessage(responseMessage);

      isInFullscreenMode
        ? this.hideIframeExitElement()
        : this.showIframeExitElement();
    };
  }

  /**
   * Determines if the browser is in fullscreen mode.
   */
  private isDocInFullscreenMode() {
    const doc = <BrowserDocument>document;
    return (
      doc.fullscreenElement ||
      doc.isFullScreen ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement
    );
  }

  /**
   * Enters the browser into fullscreen mode.
   */
  private enterFullscreenMode() {
    const docElement = <BrowserDocumentElement>document.documentElement;

    // Enters fullscreen mode based upon the browsers fullscreen method
    if (docElement.requestFullscreen) {
      docElement.requestFullscreen();
    } else if (docElement.webkitRequestFullscreen) {
      docElement.webkitRequestFullscreen();
    } else if (docElement.msRequestFullscreen) {
      docElement.msRequestFullscreen();
    } else if (docElement.requestFullScreen) {
      docElement.requestFullScreen();
    } else if (docElement.mozRequestFullScreen) {
      docElement.mozRequestFullScreen();
    }

    this.hideIframeExitElement();
  }

  /**
   * Exits the browser from fullscreen mode.
   */
  private exitFullscreenMode() {
    const doc = <BrowserDocument>document;

    // Exits fullscreen mode
    if (doc.exitFullscreen) {
      doc.exitFullscreen();
    } else if (doc.webkitExitFullscreen) {
      doc.webkitExitFullscreen();
    } else if (doc.msExitFullscreen) {
      doc.msExitFullscreen();
    } else if (doc.cancelFullScreen) {
      doc.cancelFullScreen();
    } else if (doc.mozCancelFullScreen) {
      doc.mozCancelFullScreen();
    }

    this.showIframeExitElement();
  }

  /**
   * Displays JayCloud exit navigation link after exiting fullscreen mode
   */
  private showIframeExitElement() {
    if (this.iframeExitElement) {
      this.iframeExitElement.style.display = "block";
    }
  }

  /**
   * Hides JayCloud exit navigation link while in fullscreen mode
   */
  private hideIframeExitElement() {
    if (this.iframeExitElement) {
      this.iframeExitElement.style.display = "none";
    }
  }

  /**
   * Sets up receiving messages from JayCloud's service loaded in the iframe.
   */
  private setupReceivingMessages() {
    window.onmessage = (event: MessageEvent) => {
      // If the message is from the service that's loaded in the iframe
      if (event.origin === this.serviceFullUrl) {
        const eventData = event.data;

        // If the message is an api request
        if (messageEventData.isApiMessage(eventData)) {
          this.sendApiRequest(eventData);
        }

        // If the message is to enter fullscreen
        else if (
          messageEventData.isEnterFullscreenMessage(eventData) &&
          !this.isDocInFullscreenMode()
        ) {
          this.enterFullscreenMode();
        }

        // If the message is to exit fullscreen
        else if (
          messageEventData.isExitFullscreenMessage(eventData) &&
          this.isDocInFullscreenMode()
        ) {
          this.exitFullscreenMode();
        }
      }
    };
  }

  /**
   * Sends an api request on behalf of the service in the iframe.
   * @param request The request information to send to the api
   */
  private async sendApiRequest(request: IframeMessageApiRequest) {
    const requestData: DataRequest = {
      serviceId: this.service._id,
      apiPath: request.payload.apiPath,
      apiMethod: request.payload.apiMethod,
      ...request.payload.data,
    };

    const response = await apiService.request(apiService.routes.any.data, {
      method: "POST",
      data: requestData,
    });

    const responseMessage: IframeMessageApiResponse = {
      action: request.action,
      payload: {
        apiPath: request.payload.apiPath,
        apiMethod: request.payload.apiMethod,
      },
    };

    if (!isAxiosError(response)) {
      responseMessage.payload.data = response.data;
      this.postMessage(responseMessage);
    } else {
      responseMessage.payload.error = response.message;
      this.postMessage(responseMessage);
    }
  }

  /**
   * Posts a message to the service loaded in the iframe
   * @param message The message to send to the iframe
   */
  private postMessage = (
    message: IframeMessageApiResponse | IframeMessageFullscreenResponse
  ) => {
    if (this.iframe.contentWindow) {
      this.iframe.contentWindow.postMessage(message, {
        targetOrigin: this.serviceFullUrl,
      });
    }
  };
}
