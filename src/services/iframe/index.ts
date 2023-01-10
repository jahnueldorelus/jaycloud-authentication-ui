import { Service } from "@app-types/entities";
import {
  IframeAPIResponse as IframeMessageAPIResponse,
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
  private serviceFullUrl: string;

  constructor(iframe: HTMLIFrameElement, service: Service) {
    this.iframe = iframe;
    this.service = service;
    this.serviceFullUrl = `${this.service.uiUrl}:${this.service.uiPort}`;
    this.setupReceivingMessages();
  }

  private setupReceivingMessages() {
    window.onmessage = (event: MessageEvent) => {
      // If the message is from the service that's loaded in the iframe
      if (event.origin === this.serviceFullUrl) {
        const eventData: IframeMessageEventData = event.data;
        // If the message is an api request
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
      apiMethod: request.payload.apiMethod,
      ...request.payload.data,
    };

    const response = await apiService.request(apiService.routes.any.data, {
      method: "POST",
      data: requestData,
    });

    const responseMessage: IframeMessageAPIResponse = {
      apiPath: request.payload.apiPath,
      apiMethod: request.payload.apiMethod,
    };

    if (!isAxiosError(response)) {
      responseMessage.data = response.data;
      this.postMessage(responseMessage);
    } else {
      responseMessage.error = response.message;
      this.postMessage(responseMessage);
    }
  }

  /**
   * Posts a message to the service loaded in the iframe
   * @param message The message to send to the iframe
   */
  private postMessage = (message: any) => {
    if (this.iframe.contentWindow) {
      this.iframe.contentWindow.postMessage(message, {
        targetOrigin: this.serviceFullUrl,
      });
    }
  };
}
