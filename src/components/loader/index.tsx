import Container from "react-bootstrap/Container";
import "./index.scss";

export const Loader = () => {
  return (
    <Container className="d-flex flex-column align-items-center">
      <Container className="px-0 d-flex justify-content-center">
        <div className="app-loader spinner-grow bg-primary" role="status" />
        <div className="app-loader spinner-grow bg-tertiary" role="status" />
        <div className="app-loader spinner-grow bg-quinary" role="status" />
        <div className="app-loader spinner-grow bg-tertiary" role="status" />
        <div className="app-loader spinner-grow bg-primary" role="status" />
      </Container>
      <h3 className="px-3 py-2 mt-5 bg-primary text-white rounded">Loading</h3>
    </Container>
  );
};
