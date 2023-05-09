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
            href="https://www.linkedin.com/in/jahnueldorelus/"
            target="_blank"
            rel="nofollow"
            aria-label="visit Jahnuel Dorelus's LinkedIn profile"
          >
            Jahnuel Dorelus
          </a>
        </p>
      </Container>
    </Container>
  );
};
