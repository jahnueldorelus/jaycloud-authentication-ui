import { Service } from "@app-types/entities";
import {
  IframeMessageApi,
  IframeMessageEventData,
  messageEventData,
} from "@app-types/services/iframe";
import { apiService } from "@services/api";
import { DataRequest } from "@app-types/services/api";
import { isAxiosError } from "axios";

export class IframeService {
  private iframe: HTMLIFrameElement;
  private service: Service;

  constructor(iframe: HTMLIFrameElement, service: Service) {
    this.iframe = iframe;
    this.service = service;
    this.setupReceivingMessages();
  }

  private setupReceivingMessages() {
    window.onmessage = (event: MessageEvent) => {
      if (event.origin === `${this.service.uiUrl}:${this.service.uiPort}`) {
        console.log("Received from child!", event);
        const eventData: IframeMessageEventData = event.data;

        if (messageEventData.isApiMessage(eventData)) {
          this.sendApiRequest(eventData);
        }
      }
    };
  }

  /**
   * Sends an api request on behalf of the service in the iframe.
   * @param request The request information to send to the api
   */
  private async sendApiRequest(request: IframeMessageApi) {
    const requestData: DataRequest = {
      serviceId: this.service._id,
      apiPath: request.payload.apiPath,
      ...request.payload.data,
    };
    console.log("Sending to:", apiService.routes.any.data, requestData);
    const response = await apiService.request(apiService.routes.any.data, {
      method: request.payload.method,
      data: requestData,
    });
    console.log(response);

    // If a response was returned
    if (response && !isAxiosError(response)) {
    }
    // If an error occurred
    else {
    }
  }

  /**
   * Posts a message to the service loaded in the iframe
   * @param message The message to send to the iframe
   */
  private postMessage = (message: any) => {
    if (this.iframe.contentWindow)
      this.iframe.contentWindow.postMessage(message);
  };
}
