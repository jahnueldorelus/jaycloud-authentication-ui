import { NavLink } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { uiRoutes } from "@components/navbar/routes";
import NotFoundDoggy from "@assets/404-doggy.svg";
import { testDataIds } from "@tests/helper";

type ErrorCardProps = {
  title?: string;
  message?: string;
};

export const ErrorCard = (props: ErrorCardProps) => {
  return (
    <Container
      className="d-flex justify-content-center"
      data-testid={testDataIds.appError.card}
    >
      <Card className="w-fit rounded overflow-hidden border border-primary">
        <Card.Header className="px-3 py-2 bg-primary text-white fs-3">
          <h3 className="m-0" data-testid={testDataIds.appError.title}>
            {props.title || "Uh-oh! JayDog was found!"}
          </h3>
        </Card.Header>
        <Card.Body className="px-3 py-4 d-flex flex-column align-items-center">
          <Card.Img src={NotFoundDoggy} width="100" />
          <Card.Text
            className="mt-4 fs-5 text-center text-md-start"
            data-testid={testDataIds.appError.message}
          >
            {props.message ||
              "Woof! Sorry my good human, looks like you got lost! Navigate to the home page and try again."}
          </Card.Text>
          <NavLink className="mt-3" to={uiRoutes.home}>
            <Button variant="primary">Return Home</Button>
          </NavLink>
        </Card.Body>
      </Card>
    </Container>
  );
};
