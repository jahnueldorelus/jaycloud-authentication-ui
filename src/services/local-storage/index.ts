class LocalStorageService {
  /**
   * Sets the user's refresh token into local storage.
   * @param token The token to save in local storage
   */
  setRefreshToken = (token: string) => {
    window.localStorage.setItem("reftok", token);
  };

  /**
   * Retrieves the user's refresh token from local storage.
   * @returns The user's refresh token
   */
  getRefreshToken = (): string => {
    const refreshToken = window.localStorage.getItem("reftok");
    return refreshToken ? refreshToken : "";
  };

  /**
   * Removes the user's refresh token from local storage.
   */
  removeRefreshToken = () => {
    window.localStorage.removeItem("reftok");
  };
}

export const localStorageService = new LocalStorageService();
