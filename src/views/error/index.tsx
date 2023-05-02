import { AppFooter } from "@components/footer";
import { AppNavbar } from "@components/navbar";
import { Fragment, useRef, useState, useEffect } from "react";
import { appContentHeightService } from "@services/app-content-height";
import { ErrorCard } from "@views/error/components/error-card";

export const ErrorPage = () => {
  const headerRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const [minimumContentHeight, setMinimumContentHeight] = useState<number>(0);

  /**
   * Handles setting up the app content height service.
   */
  useEffect(() => {
    if (!appContentHeightService.setMinContentHeight) {
      appContentHeightService.setMinContentHeight = setMinimumContentHeight;
    }
    if (headerRef.current !== appContentHeightService.headerRef?.current) {
      appContentHeightService.headerRef = headerRef;
    }
    if (footerRef.current !== appContentHeightService.footerRef?.current) {
      appContentHeightService.footerRef = footerRef;
    }

    appContentHeightService.calculateNewHeight();

    return () => {
      appContentHeightService.setMinContentHeight = null;
      appContentHeightService.headerRef = null;
      appContentHeightService.footerRef = null;
    };
  }, [headerRef.current, footerRef.current]);

  return (
    <Fragment>
      <header ref={headerRef}>
        <AppNavbar />
      </header>
      <main
        className="py-5 d-flex justify-content-center align-items-start"
        style={{ minHeight: minimumContentHeight }}
      >
        <ErrorCard />
      </main>
      <footer ref={footerRef}>
        <AppFooter />
      </footer>
    </Fragment>
  );
};
