import { AppNavbar } from "@components/navbar";
import { AuthProvider } from "./store";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Fragment, useEffect, useRef, useState } from "react";
import { AppFooter } from "@components/footer";
import { uiRoutes } from "./routes";
import Container from "react-bootstrap/Container";
import "./App.scss";

function App() {
  const location = useLocation();
  const headerRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const [minimumContentHeight, setMinimumContentHeight] = useState<number>(0);

  /**
   * Sets the minimum height of the main content. This makes the
   * content on the page to have the full height of the window.
   */
  useEffect(() => {
    setMinimumMainContentHeight();

    window.addEventListener("resize", () => {
      if (window.outerHeight !== minimumContentHeight) {
        setMinimumMainContentHeight();
      }
    });

    return () => {
      window.removeEventListener("resize", () => {});
    };
  }, [location.pathname]);

  /**
   * Sets the minimum height of the main content. This makes the
   * content on the page to have the full height of the window.
   */
  const setMinimumMainContentHeight = () => {
    if (headerRef.current && footerRef.current) {
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
    if (!location.pathname.includes(uiRoutes.loadService)) {
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
          <Link className="text-decoration-none" to={uiRoutes.services}>
            <Container
              className="py-2 ps-4 bg-primary d-flex align-items-center text-white"
              fluid
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
            </Container>
          </Link>
          <Outlet />
        </Fragment>
      );
    }
  };

  return (
    <AuthProvider>
      <div className="app">{getAppBodyJSX()}</div>
    </AuthProvider>
  );
}

export default App;
