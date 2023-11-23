import { APIRequestConfig } from "@app-types/services/api";
import { apiService } from "@services/api";

describe("Service - API", () => {
  const mockHelperFns = vi.hoisted(() => ({
    axiosDefault: vi.fn(),
  }));
  const mocks = vi.hoisted(() => ({
    axios: {
      default: mockHelperFns.axiosDefault,
    },
  }));

  vi.mock("axios", () => mocks.axios);

  it("Should make a successful request to the API", async () => {
    const dummyData = "I'm successful dummy data!";
    mockHelperFns.axiosDefault.mockReturnValueOnce(Promise.resolve(dummyData));

    const result = await apiService.request(apiService.routes.any.data);
    expect(result).toBe(dummyData);
  });

  it("Should add configuration for the request to the API", async () => {
    const apiConfig: APIRequestConfig = {
      method: "get",
    };

    await apiService.request(apiService.routes.any.data, apiConfig);

    expect(mockHelperFns.axiosDefault).toHaveBeenCalledWith(
      expect.anything(),
      apiConfig
    );
  });

  it("Should make a failed request to the API", async () => {
    const errorMessage = "failed-request";
    mockHelperFns.axiosDefault.mockImplementationOnce(async () => {
      throw "failed-request";
    });

    const result = await apiService.request(apiService.routes.any.data);

    expect(result).toBe(errorMessage);
  });
});
