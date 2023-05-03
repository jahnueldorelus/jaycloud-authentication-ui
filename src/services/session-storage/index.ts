class SessionStorageService {
  /**
   * Sets the view before authentication.
   * @param pathname The pathname to save in storage
   */
  setViewBeforeAuth = (pathname: string) => {
    window.sessionStorage.setItem("viewBeforeAuth", pathname);
  };

  /**
   * Retrieves the view before authentication.
   */
  getViewBeforeAuth = (): string | null => {
    const viewBeforeAuth = window.sessionStorage.getItem("viewBeforeAuth");
    return viewBeforeAuth ? viewBeforeAuth : null;
  };

  /**
   * Removes the view before authentication.
   */
  removeViewBeforeAuth = () => {
    window.sessionStorage.removeItem("viewBeforeAuth");
  };
}

export const sessionStorageService = new SessionStorageService();
