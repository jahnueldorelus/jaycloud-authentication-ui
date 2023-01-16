import { uiRoutes } from "@components/navbar/routes";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { NavLink } from "react-router-dom";
import "./index.scss";

export const UIError = () => {
  return (
    <Container
      className="app-ui-error px-0 rounded overflow-hidden shadow"
      fluid
    >
      <h3 className="mb-0 px-3 py-3 bg-primary text-white">
        Uh-oh, something went wrong :(
      </h3>
      <Container className="bg-tertiary text-primary">
        <h4 className="px-3 pt-3 pb-2 fs-5">
          An error has occurred that prevented the page from loading. Please
          navigate to the home page and try again.
        </h4>

        <h5 className="px-3 pt-3 pb-2 fs-6">
          If this is a frequent issue, please&nbsp;
          <a href="mailto:support@jahnueldorelus.com">contact us</a>.
        </h5>
        <Container className="py-3 d-flex justify-content-center">
          <NavLink to={uiRoutes.home}>
            <Button variant="primary">Return Home</Button>
          </NavLink>
        </Container>
      </Container>
    </Container>
  );
};
