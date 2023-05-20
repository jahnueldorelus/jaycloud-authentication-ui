import Container from "react-bootstrap/Container";

export const AppFooter = () => {
  return (
    <Container className="bg-primary text-white py-2" fluid>
      <Container
        className="d-flex justify-content-between flex-column flex-sm-row text-center"
        fluid="md"
      >
        <p className="m-0">&#174;&nbsp;JayCloud Corp</p>
        <p className="m-0">
          Made by&nbsp;
          <a
            className="text-secondary text-decoration-none"
            href="https://www.jahnueldorelus.com"
            target="_blank"
            aria-label="Jahnuel Dorelus's personal website"
          >
            Jahnuel Dorelus
          </a>
        </p>
      </Container>
    </Container>
  );
};
