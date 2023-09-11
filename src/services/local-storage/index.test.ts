import { localStorageService } from "@services/local-storage";

describe("Service - Local Storage", () => {
  const dummyRefreshToken = "xxxxx-xxxxx-xxxxx";

  it("Should set the user's refresh token", () => {
    expect(window.localStorage.length).toBe(0);

    localStorageService.setRefreshToken(dummyRefreshToken);
    expect(window.localStorage.length).toBe(1);
  });

  it("Should retrieve the user's refresh token", () => {
    localStorageService.setRefreshToken(dummyRefreshToken);
    const refreshToken = localStorageService.getRefreshToken();

    expect(refreshToken).toBe(dummyRefreshToken);
  });

  it("Should remove the user's refresh token", () => {
    localStorageService.setRefreshToken(dummyRefreshToken);
    expect(window.localStorage.length).toBe(1);

    localStorageService.removeRefreshToken();
    expect(window.localStorage.length).toBe(0);
  });
});
