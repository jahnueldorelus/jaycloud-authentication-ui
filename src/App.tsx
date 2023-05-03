import { AppNavbar } from "@components/navbar";
import { Outlet, useLocation } from "react-router-dom";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { AppFooter } from "@components/footer";
import { appContentHeightService } from "@services/app-content-height";
import { setupAxiosInterceptors } from "@services/axios-interceptors";
import { userContext } from "@context/user";
import "./App.scss";
import { uiRoutes } from "@components/navbar/routes";
import { sessionStorageService } from "@services/session-storage";

function App() {
  const location = useLocation();
  const headerRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const backToJayCloudRef = useRef<HTMLDivElement>(null);
  const [minimumContentHeight, setMinimumContentHeight] = useState<number>(0);
  const userConsumer = useContext(userContext);

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
    if (
      backToJayCloudRef.current !==
      appContentHeightService.backToJayCloudRef?.current
    ) {
      appContentHeightService.backToJayCloudRef = backToJayCloudRef;
    }
  }, [headerRef.current, footerRef.current, backToJayCloudRef.current]);

  /**
   * Sets the minimum height of the main content on page load and on location
   * change. Also resets session storage information based upon the current page.
   */
  useEffect(() => {
    appContentHeightService.calculateNewHeight();

    // Removes session storage auth info if the user navigates away from the login and register page
    if (
      location.pathname !== uiRoutes.login &&
      location.pathname !== uiRoutes.register
    ) {
      sessionStorageService.removeViewBeforeAuth();
    }
  }, [location.pathname]);

  /**
   * Sets up a window listener to calculate the new content height size whenever the
   * window's height or width changes.
   */
  useEffect(() => {
    const resizeListenerFunction = appContentHeightService.calculateNewHeight;

    if (window.visualViewport) {
      /**
       * This is added for all devices that have a visual viewport whose height
       * is different than the window object. This fixes an issue on Safari iOS where
       * a window resize event isn't triggered upon the controls of the browser
       * expanding/collapsing.
       */
      window.visualViewport.addEventListener("resize", resizeListenerFunction);
    } else {
      window.addEventListener("resize", resizeListenerFunction);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener(
          "resize",
          resizeListenerFunction
        );
      } else {
        window.removeEventListener("resize", resizeListenerFunction);
      }
    };
  }, []);

  /**
   * Sets up the axios interceptors.
   */
  useEffect(() => {
    setupAxiosInterceptors(userConsumer.methods);
  }, []);

  /**
   * Retrieves the app's body content
   */
  const getAppBodyJSX = () => {
    return (
      <Fragment>
        <header
          className="position-sticky top-0"
          style={{ zIndex: 1 }}
          ref={headerRef}
        >
          <AppNavbar />
        </header>
        <main className="d-flex" style={{ minHeight: minimumContentHeight }}>
          <Outlet />
        </main>
        <footer ref={footerRef}>
          <AppFooter />
        </footer>
      </Fragment>
    );
  };

  return <div>{getAppBodyJSX()}</div>;
}

export default App;
