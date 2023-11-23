import { Service } from "@app-types/entities";
import { APIRequestConfig } from "@app-types/services/api";
import { apiService } from "@services/api";
import { AxiosError, AxiosResponse } from "axios";
import { SpyInstance } from "vitest";
import { cloudService } from "@services/cloud-service";

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
    apiServiceRequestHelper: vi.fn(),
    apiServiceRequest: vi.fn() as SpyInstance<
      [apiPath: string, config?: APIRequestConfig | undefined],
      Promise<AxiosResponse<any, any> | AxiosError<any, any>>
    >,
  }));

  beforeEach(() => {
    // Mocks the API service request initiator
    mocks.apiServiceRequest = vi
      .spyOn(apiService, "request")
      .mockImplementation(mocks.apiServiceRequestHelper);
  });

  afterEach(() => {
    mocks.apiServiceRequest.mockRestore();
  });

  it("Should fail to get the list of services", async () => {
    mocks.apiServiceRequestHelper.mockImplementationOnce(async () => {
      throw Error();
    });

    await cloudService.getServices();

    expect(cloudService.servicesList).toBeNull();
  });

  it("Should get list of services", async () => {
    mocks.apiServiceRequestHelper.mockImplementationOnce(
      async (url: string) => {
        const axiosResponse: AxiosResponse = <AxiosResponse>{
          data: dummyServices,
        };

        return url === apiService.routes.get.services.list
          ? axiosResponse
          : null;
      }
    );

    await cloudService.getServices();

    expect(cloudService.servicesList).toBe(dummyServices);
  });
});
