import { AppNavbar } from "@components/navbar";
import { AuthProvider } from "./store";
import { Outlet } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./App.scss";

function App() {
  const headerRef = useRef<HTMLElement>(null);
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
  }, []);

  /**
   * Sets the minimum height of the main content. This makes the
   * content on the page to have the full height of the window.
   */
  const setMinimumMainContentHeight = () => {
    if (headerRef.current) {
      setMinimumContentHeight(
        window.innerHeight - headerRef.current.offsetHeight
      );
    }
  };

  return (
    <AuthProvider>
      <div className="app">
        <header ref={headerRef}>
          <AppNavbar />
        </header>
        <main className="d-flex" style={{ minHeight: minimumContentHeight }}>
          <Outlet />
        </main>
        <footer></footer>
      </div>
    </AuthProvider>
  );
}

export default App;
