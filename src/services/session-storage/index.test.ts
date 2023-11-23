import { sessionStorageService } from "@services/session-storage";

describe("Service - Session Storage", () => {
  const viewBeforeAuth = "/view-before-auth";

  it("Should set the view before authentication", () => {
    expect(window.sessionStorage.length).toBe(0);

    sessionStorageService.setViewBeforeAuth(viewBeforeAuth);
    expect(window.sessionStorage.length).toBe(1);
  });

  it("Should retrieve the view before authentication", () => {
    sessionStorageService.setViewBeforeAuth(viewBeforeAuth);
    const view = sessionStorageService.getViewBeforeAuth();

    expect(view).toBe(viewBeforeAuth);
  });

  it("Should remove the view before authentication", () => {
    sessionStorageService.setViewBeforeAuth(viewBeforeAuth);
    expect(window.sessionStorage.length).toBe(1);

    sessionStorageService.removeViewBeforeAuth();
    expect(window.sessionStorage.length).toBe(0);
  });
});
