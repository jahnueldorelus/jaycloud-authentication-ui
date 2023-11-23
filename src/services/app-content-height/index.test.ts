import { appContentHeightService } from "@services/app-content-height";
import { RefObject } from "react";

describe("Service - App Content Height", () => {
  it("Should calculate the correct height of the app", () => {
    const [windowHeight, headerHeight, footerHeight] = [1000, 250, 250];

    // Mocks the window object
    vi.spyOn(window, "window", "get").mockReturnValue({
      innerHeight: windowHeight,
    } as typeof window.window);

    // Mocks the min content height setter in the service
    const mockSetMinContentHeight = vi.fn();
    appContentHeightService.setMinContentHeight = mockSetMinContentHeight;

    const headerRef: RefObject<HTMLElement> = {
      current: <HTMLElement>{ offsetHeight: headerHeight },
    };

    const footerRef: RefObject<HTMLElement> = {
      current: <HTMLElement>{ offsetHeight: footerHeight },
    };

    appContentHeightService.headerRef = headerRef;
    appContentHeightService.footerRef = footerRef;

    appContentHeightService.calculateNewHeight();

    expect(mockSetMinContentHeight).toHaveBeenCalledWith(
      windowHeight - headerHeight - footerHeight
    );
  });
});
