import Container from "react-bootstrap/Container";

export const AppFooter = () => {
  return (
    <Container className="bg-primary text-white py-1" fluid>
      <Container className="d-flex justify-content-between" fluid="md">
        <p className="m-0">&#174;&nbsp;JayCloud Corp</p>
        <p className="m-0">
          Made by{" "}
          <a
            className="text-secondary text-decoration-none"
            href="https://www.linkedin.com/in/jahnueldorelus/"
            target="_blank"
          >
            Jahnuel Dorelus
          </a>
        </p>
      </Container>
    </Container>
  );
};
