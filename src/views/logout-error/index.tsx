import { ErrorCard } from "@views/error/components/error-card";
import Container from "react-bootstrap/Container";

export const LogoutError = () => {
  return (
    <Container className="my-5">
      <ErrorCard
        title="Logout Error"
        message="It appears an error occurred trying to log out. Please return home and try again."
      />
    </Container>
  );
};
