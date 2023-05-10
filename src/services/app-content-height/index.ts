import { RefObject } from "react";

class AppContentHeight {
  headerRef: RefObject<HTMLElement> | null;
  footerRef: RefObject<HTMLElement> | null;
  setMinContentHeight: ((newHeight: number) => void) | null;

  constructor() {
    this.headerRef = null;
    this.footerRef = null;
    this.setMinContentHeight = null;
  }

  /**
   * Sets the minimum height of the main content. This makes the
   * content on the page to have the full height of the window.
   */
  calculateNewHeight = () => {
    if (
      this.setMinContentHeight &&
      this.headerRef &&
      this.headerRef.current &&
      this.footerRef &&
      this.footerRef.current
    ) {
      this.setMinContentHeight(
        window.innerHeight -
          this.headerRef.current.offsetHeight -
          this.footerRef.current.offsetHeight
      );
    }
  };
}

export const appContentHeightService = new AppContentHeight();
