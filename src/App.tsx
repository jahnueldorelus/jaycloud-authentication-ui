import { AppNavbar } from "@components/navbar";
import { Outlet, useLocation } from "react-router-dom";
import React, {
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AppFooter } from "@components/footer";
import { appContentHeightService } from "@services/app-content-height";
import { setupAxiosInterceptors } from "@services/axios-interceptors";
import { userContext } from "@context/user";
import { uiRoutes } from "@components/navbar/routes";
import { sessionStorageService } from "@services/session-storage";
import Button from "react-bootstrap/Button";
import "./App.scss";
import { FocusableReference } from "@components/focusable-reference";

function App() {
  const location = useLocation();
  const topOfPageRef = useRef<HTMLDivElement>(null);
  const topOfMainRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const [minimumContentHeight, setMinimumContentHeight] = useState<number>(0);
  const userConsumer = useContext(userContext);
  const navigationZIndex = 990;

  /**
   * Handles setting up the app content height service.
   */
  useEffect(() => {
    // Passes the min content height setter to the content height service
    if (!appContentHeightService.setMinContentHeight) {
      appContentHeightService.setMinContentHeight = setMinimumContentHeight;
    }
    // Passes the reference of the header tag to the content height service
    if (headerRef.current !== appContentHeightService.headerRef?.current) {
      appContentHeightService.headerRef = headerRef;
    }
    // Passes the reference of the footer tag to the content height service
    if (footerRef.current !== appContentHeightService.footerRef?.current) {
      appContentHeightService.footerRef = footerRef;
    }
  }, [headerRef.current, footerRef.current]);

  /**
   * Sets the minimum height of the main content on location change, scrolls
   * back to the top of the page, focuses at the beginning of the navbar,
   * and resets session storage information depending upon the current page.
   */
  useEffect(() => {
    appContentHeightService.calculateNewHeight();

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    if (topOfPageRef.current) {
      topOfPageRef.current.focus();
    }

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
   * window's height or width changes. Also sets up the axios interceptors.
   */
  useEffect(() => {
    setupAxiosInterceptors(userConsumer.methods);
    const resizeListenerFunction = appContentHeightService.calculateNewHeight;

    // For mobile devices
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", resizeListenerFunction);
    }
    // For regular devices
    else {
      window.addEventListener("resize", resizeListenerFunction);
    }

    return () => {
      // For mobile devices
      if (window.visualViewport) {
        window.visualViewport.removeEventListener(
          "resize",
          resizeListenerFunction
        );
      }
      // For regular devices
      else {
        window.removeEventListener("resize", resizeListenerFunction);
      }
    };
  }, []);

  /**
   * Changes the focus to the main content.
   */
  const onSkipMainContentClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    if (topOfMainRef.current) {
      topOfMainRef.current.focus();
    }
  };

  /**
   * Retrieves the app's body content
   */
  const getAppBodyJSX = () => {
    return (
      <Fragment>
        <FocusableReference ref={topOfPageRef} />

        <Button
          className="visually-hidden-focusable px-2 py-1 ms-2 mt-2 mb-0 bg-white text-primary border border-primary rounded w-fit position-absolute top-0"
          style={{ zIndex: navigationZIndex + 1 }}
          onClick={onSkipMainContentClick}
        >
          Skip to main content
        </Button>

        {/* Header of the application */}
        <header
          className="position-sticky top-0"
          style={{ zIndex: navigationZIndex }}
          ref={headerRef}
          tabIndex={-1}
        >
          <AppNavbar />
        </header>

        {/* Main content of the application */}
        <FocusableReference ref={topOfMainRef} />

        <main className="d-flex" style={{ minHeight: minimumContentHeight }}>
          <Outlet />
        </main>

        {/* Footer of the application */}
        <footer ref={footerRef}>
          <AppFooter />
        </footer>
      </Fragment>
    );
  };

  return <div>{getAppBodyJSX()}</div>;
}

export default App;
