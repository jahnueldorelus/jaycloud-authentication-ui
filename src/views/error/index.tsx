import { AppFooter } from "@components/footer";
import { AppNavbar } from "@components/navbar";
import { Fragment, useRef, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { appContentHeightService } from "@services/app-content-height";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { uiRoutes } from "@components/navbar/routes";
import NotFoundDoggy from "@assets/404-doggy.svg";

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
        <Container className="d-flex justify-content-center">
          <Card className="w-fit rounded overflow-hidden border border-primary">
            <Card.Header className="px-3 py-2 bg-primary text-white fs-3">
              <h3 className="m-0">Uh-oh! JayDog was found!</h3>
            </Card.Header>
            <Card.Body className="px-3 py-4 d-flex flex-column align-items-center">
              <Card.Img src={NotFoundDoggy} width="100" />
              <Card.Text className="mt-4 fs-5 text-center text-md-start">
                "Woof! Sorry my good human, looks like you got lost! Navigate to
                the home page and try again."
              </Card.Text>
              <NavLink className="mt-3" to={uiRoutes.home}>
                <Button variant="primary">Return Home</Button>
              </NavLink>
            </Card.Body>
          </Card>
        </Container>
      </main>
      <footer ref={footerRef}>
        <AppFooter />
      </footer>
    </Fragment>
  );
};
