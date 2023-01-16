import { AppNavbar } from "@components/navbar";
import { AuthProvider } from "./store";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Fragment, useEffect, useRef, useState } from "react";
import { AppFooter } from "@components/footer";
import { uiRoutes } from "./routes";
import Container from "react-bootstrap/Container";
import { ClassName } from "@services/class-name";
import "./App.scss";

function App() {
  const location = useLocation();
  const headerRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const backToJayCloudRef = useRef<HTMLDivElement>(null);
  const [minimumContentHeight, setMinimumContentHeight] = useState<number>(0);
  const isLocationLoadService = location.pathname.includes(
    uiRoutes.loadService
  );
  const appBodyClass = new ClassName("app").addClass(
    isLocationLoadService,
    "overflow-hidden",
    "overflow-auto"
  ).fullClass;

  /**
   * Both useEffects sets the minimum height of the main content on page load and
   * on location change. This makes the content on the page to have the full height 
   * of the window.
   */
  useEffect(() => {
    setMinimumMainContentHeight();
  }, [location.pathname])

  useEffect(() => {
    const resizeListenerFunction = () => setMinimumMainContentHeight();

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
   * Sets the minimum height of the main content. This makes the
   * content on the page to have the full height of the window.
   */
  const setMinimumMainContentHeight = () => {
    if (isLocationLoadService && backToJayCloudRef.current) {
      setMinimumContentHeight(
        window.innerHeight - backToJayCloudRef.current.offsetHeight
      );
    } else if (headerRef.current && footerRef.current) {
      setMinimumContentHeight(
        window.innerHeight -
        headerRef.current.offsetHeight -
        footerRef.current.offsetHeight
      );
    }
  };

  /**
   * Retrieves the app's body content. The view to load a service
   * is different from the default view of the entire application.
   */
  const getAppBodyJSX = () => {
    // View is to not load a service
    if (!isLocationLoadService) {
      return (
        <Fragment>
          <header ref={headerRef}>
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
    }
    // View is to load a service
    else {
      return (
        <Fragment>
          <Container
            id="jaycloud-service-exit"
            className="py-3 ps-4 bg-primary"
            fluid
            ref={backToJayCloudRef}
          >
            <Link
              className="w-fit d-flex align-items-center text-decoration-none text-white"
              to={uiRoutes.services}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z" />
              </svg>
              <h1 className="ms-2 mb-0 fs-6">Back to JayCloud</h1>
            </Link>
          </Container>

          <Container
            className="px-0"
            fluid
            style={{ height: minimumContentHeight }}
          >
            <Outlet />
          </Container>
        </Fragment>
      );
    }
  };

  return (
    <AuthProvider>
      <div className={appBodyClass}>{getAppBodyJSX()}</div>
    </AuthProvider>
  );
}

export default App;
