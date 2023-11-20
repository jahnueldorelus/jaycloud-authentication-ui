import { APIRequestConfig } from "@app-types/services/api";
import { apiService } from "@services/api";
import { AxiosError, AxiosResponse } from "axios";
import { SpyInstance } from "vitest";
import { userService } from "@services/user";
import { ServiceRedirectUrl } from "@app-types/services/user";
import { uiRoutes } from "@components/navbar/routes";

describe("Service - User", () => {
  const dummyApiResponseData = { data: <any>"dummy-data" };
  const axiosResponse: AxiosResponse = <AxiosResponse>{
    data: dummyApiResponseData,
    headers: {},
  };

  const mocks = vi.hoisted(() => ({
    apiServiceRequest: <
      SpyInstance<
        [apiPath: string, config?: APIRequestConfig | undefined],
        Promise<AxiosResponse<any, any> | AxiosError<any, any>>
      >
    >vi.fn(),
    locationReplace: vi.fn(),
  }));

  beforeEach(() => {
    // Mocks the API service request initiator
    mocks.apiServiceRequest = vi
      .spyOn(apiService, "request")
      .mockImplementation(async () => <AxiosResponse | AxiosError>{});

    // Redefines the window location property to allow for mocks
    Object.defineProperty(window, "location", {
      value: {
        ...location,
        replace: mocks.locationReplace,
      },
      writable: true,
    });
  });

  afterEach(() => {
    mocks.apiServiceRequest.mockRestore();
    mocks.locationReplace.mockClear();

    // Restores the window's location object to
    Object.defineProperty(window, "location", {
      value: {
        ...location,
      },
      writable: false,
    });
  });

  /**
   ***************************** SUCCESSFUL REQUESTS *****************************
   */
  describe("Should pass api requests", () => {
    beforeEach(() => {
      mocks.apiServiceRequest.mockReturnValueOnce(
        Promise.resolve(axiosResponse)
      );
    });

    it("Create a new user", async () => {
      const response = await userService.createUser({});

      expect(response.data).toBe(dummyApiResponseData);
      expect(response.errorOccurred).toBe(false);
    });

    it("Authenticate a user", async () => {
      const response = await userService.authenticateUser({});

      expect(response.data).toBe(dummyApiResponseData);
      expect(response.errorOccurred).toBe(false);
    });

    it("Redirect user to previous service before authenticating", async () => {
      const [originalResponseData, newResponseData] = [
        axiosResponse.data,
        <ServiceRedirectUrl>{ serviceUrl: "/service-url" },
      ];
      axiosResponse.data = newResponseData;
      await userService.redirectToPreviousService();
      axiosResponse.data = originalResponseData;

      expect(mocks.locationReplace).toBeCalledWith(newResponseData.serviceUrl);
    });

    it("Retrieve sso token", async () => {
      await userService.getSSOToken();

      expect(userService.userSSOToken).toBe(dummyApiResponseData);
    });

    it("Reauthorize user", async () => {
      const mockGetSSOToken = vi
        .spyOn(userService, "getSSOToken")
        .mockImplementationOnce(async () => {});
      const [originalHeaders, newHeaders] = [
        axiosResponse.headers,
        {
          "x-acc-token": "xxx-xxx",
          "x-ref-token": "xxx-xxx",
        },
      ];
      axiosResponse.headers = newHeaders;

      const response = await userService.getUserReauthorized();

      mockGetSSOToken.mockRestore();
      axiosResponse.headers = originalHeaders;

      expect(response).toBe(dummyApiResponseData);
    });

    it("Reset user password", async () => {
      const response = await userService.resetPassword({});

      expect(response.timeBeforeTokenExp).toBe(dummyApiResponseData);
      expect(response.errorOccurred).toBe(false);
    });

    it("Update user password", async () => {
      const response = await userService.updatePassword(<any>{});

      expect(response.errorOccurred).toBe(false);
    });

    it("Update user profile", async () => {
      const response = await userService.updateProfile({});

      expect(response.data).toBe(dummyApiResponseData);
      expect(response.errorOccurred).toBe(false);
    });

    it("Logout user", async () => {
      const response = await userService.logoutUser();

      expect(response).toBe(true);
    });

    it("Logout user sso redirect", async () => {
      await userService.loggedOutUserSSORedirect();

      expect(mocks.locationReplace).toHaveBeenCalledWith(axiosResponse.data);
    });
  });

  /**
   ******************************* FAILED REQUESTS *******************************
   */
  describe("Should fail api requests", async () => {
    const axiosError = <AxiosError>{ message: "fail", isAxiosError: true };

    beforeEach(() => {
      mocks.apiServiceRequest.mockReturnValueOnce(Promise.resolve(axiosError));
    });

    it("Create a new user", async () => {
      const response = await userService.createUser({});

      expect(response.errorOccurred).toBe(true);
    });

    it("Authenticate a user", async () => {
      const response = await userService.authenticateUser({});

      expect(response.errorOccurred).toBe(true);
    });

    it("Redirect user to previous service before authenticating", async () => {
      const ssoFailedPath = location.origin + uiRoutes.ssoFailed;
      await userService.redirectToPreviousService();

      expect(mocks.locationReplace).toBeCalledWith(ssoFailedPath);
    });

    it("Retrieve sso token", async () => {
      await userService.getSSOToken();

      expect(userService.userSSOToken).toBeNull();
      expect(userService.userRefreshToken).toBeFalsy();
      expect(userService.userAccessToken).toBeNull;
    });

    it("Reauthorize user", async () => {
      const mockGetSSOToken = vi
        .spyOn(userService, "getSSOToken")
        .mockImplementationOnce(async () => {});

      const response = await userService.getUserReauthorized();
      mockGetSSOToken.mockRestore();

      expect(response).toBeNull();
    });

    it("Reset user password", async () => {
      const response = await userService.resetPassword({});

      expect(response.errorOccurred).toBe(true);
    });

    it("Update user password", async () => {
      const response = await userService.updatePassword(<any>{});

      expect(response.errorOccurred).toBe(true);
    });

    it("Update user profile", async () => {
      const response = await userService.updateProfile({});

      expect(response.errorOccurred).toBe(true);
    });

    it("Logout user", async () => {
      const response = await userService.logoutUser();

      expect(response).toBe(false);
    });

    it("Logout user sso redirect", async () => {
      await userService.loggedOutUserSSORedirect();

      expect(mocks.locationReplace).not.toBeCalled();
    });
  });
});
