import { Container } from "react-bootstrap";
import { useRouteError } from "react-router-dom";

export const ErrorPage = () => {
  const error = useRouteError() as Error;

  return (
    <Container>
      <h1> Uh-oh!</h1>
      <p>Sorry, an unxpected error has occurred.</p>
      <p>{error.message}</p>
    </Container>
  );
};
