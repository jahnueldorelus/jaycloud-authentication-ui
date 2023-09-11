import { Service } from "@app-types/entities";
import { APIRequestConfig } from "@app-types/services/api";
import { apiService } from "@services/api";
import { AxiosError, AxiosResponse } from "axios";
import { SpyInstance } from "vitest";
import { cloudService } from ".";

describe("Service - Cloud Service", () => {
  // List of dummy services for testing
  const dummyServices: Service[] = [1, 2, 3].map((serviceId) => ({
    _id: serviceId.toString(),
    available: true,
    description: serviceId.toString(),
    name: serviceId.toString(),
    uiUrl: serviceId.toString(),
  }));

  const mocks = vi.hoisted(() => ({
    apiServiceRequest: vi.fn(),
    apiService: vi.fn() as SpyInstance<
      [apiPath: string, config?: APIRequestConfig | undefined],
      Promise<AxiosResponse<any, any> | AxiosError<any, any>>
    >,
  }));

  beforeEach(() => {
    // Mocks the API service request initiator
    mocks.apiService = vi
      .spyOn(apiService, "request")
      .mockImplementation(mocks.apiServiceRequest);
  });

  afterEach(() => {
    mocks.apiService.mockRestore();
  });

  it("Should fail to get the list of services", async () => {
    mocks.apiServiceRequest.mockImplementationOnce(async () => {
      throw Error();
    });

    await cloudService.getServices();

    expect(cloudService.servicesList).toBeNull();
  });

  it("Should get list of services", async () => {
    mocks.apiServiceRequest.mockImplementationOnce(async (url: string) => {
      const axiosResponse: AxiosResponse = {
        data: dummyServices,
      } as AxiosResponse;

      return url === apiService.routes.get.services.list ? axiosResponse : null;
    });

    await cloudService.getServices();

    expect(cloudService.servicesList).toBe(dummyServices);
  });
});
