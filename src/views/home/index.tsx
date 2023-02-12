import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Placeholder from "react-bootstrap/Placeholder";
import JayCloudHub from "@assets/jaycloud-home-hub.svg";
import { NavLink } from "react-router-dom";
import ServiceLogoPlaceholder from "@assets/service-logo-placeholder.svg";
import { Fragment, useEffect, useState, useRef } from "react";
import { Service } from "@app-types/entities";
import { uiRoutes } from "@components/navbar/routes";
import { cloudService } from "@services/cloud-service";
import "./index.scss";

export const Home = () => {
  const [servicesList, setServicesList] = useState<Service[] | null>(null);
  const loadedInitialData = useRef(false);

  /**
   * Retrieves the list of services.
   */
  useEffect(() => {
    if (!loadedInitialData.current) {
      const getServicesList = async () => {
        loadedInitialData.current = true;
        setServicesList(await cloudService.getServices());
      };

      getServicesList();
    }
  }, []);

  const serviceCardJSX = (cardKey: string | number, service?: Service) => {
    let cardImage: string;
    let cardBodyContent: JSX.Element;

    if (service) {
      cardImage = service.logo
        ? URL.createObjectURL(service.logo)
        : ServiceLogoPlaceholder;

      cardBodyContent = (
        <Fragment>
          <Card.Title className="text-senary" as="h4">
            {service.name}
          </Card.Title>
          <Card.Text>{service.description}</Card.Text>
        </Fragment>
      );
    } else {
      cardImage = ServiceLogoPlaceholder;
      cardBodyContent = (
        <Fragment>
          <Placeholder animation="glow" as={Card.Title}>
            <Placeholder xs={6} />
          </Placeholder>
          <Placeholder animation="glow" as={Card.Text}>
            <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{" "}
            <Placeholder xs={6} /> <Placeholder xs={8} />
          </Placeholder>
        </Fragment>
      );
    }

    return (
      <Col className="d-flex justify-content-center" key={cardKey}>
        <Card
          className="service-card mx-2 mb-5 rounded border border-2 overflow-hidden"
          border="primary"
          text="primary"
        >
          <Container className="p-4 bg-primary d-flex justify-content-center">
            <Card.Img
              className="service-card-img"
              variant="top"
              src={cardImage}
            />
          </Container>
          <Card.Body className="service-card-body px-4 pt-3 pb-1">
            {cardBodyContent}
          </Card.Body>
        </Card>
      </Col>
    );
  };

  const serviceCardsListJSX = () => {
    // Shows list of services if available
    if (servicesList) {
      return servicesList.map((service) => {
        return serviceCardJSX(service._id, service);
      });
    }
    // Shows card placeholders if no list of services is available
    else {
      return [1, 2, 3].map((num) => {
        return serviceCardJSX(`card-placeholder-${num}`);
      });
    }
  };

  return (
    <Container className="view-home p-0" fluid>
      <Container className="section-one px-0 pt-5 bg-primary" fluid>
        <Container className="text-white d-flex flex-column flex-md-row align-items-center">
          <Container className="px-3 px-sm-0">
            <h2 className="text-secondary">Central Information Hub</h2>
            <h3 className="fs-4">
              All of your information stored in one place. No need to dig deep
              in your emails, letters, and notes trying to find that one piece
              of information you forgot about. Quickly find what you're looking
              for without any hassle with JayCloud.
            </h3>
          </Container>
          <Container className="px-5 pt-5 pt-md-0 w-fit d-flex justify-content-center">
            <img src={JayCloudHub} alt="JayCloud service hub" width="500" />
          </Container>
        </Container>
        <div className="section-one-divider">
          <svg
            data-name="layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="shape-fill"
            ></path>
          </svg>
        </div>
      </Container>

      <h3 className="pt-5 text-senary text-center fs-1">JayCloud Services</h3>

      <Container className="py-5" fluid>
        <Container>
          <Row className="g-2" md={2} lg={3}>
            {serviceCardsListJSX()}
          </Row>
        </Container>
      </Container>

      <Container className="pb-2 bg-tertiary" fluid>
        <div className="section-three-divider d-flex justify-content-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 0 2 1">
            <path className="shape-fill" d="M 0 0 L 0 0 H 1 L 0 1 L -1 0 H 0" />
          </svg>
        </div>
        <h3 className="py-5 mb-0 text-center">
          To get started, create an&nbsp;
          <NavLink className="text-senary" to={uiRoutes.register}>
            account
          </NavLink>
          &nbsp;or&nbsp;
          <NavLink className="text-senary" to={uiRoutes.login}>
            login
          </NavLink>
          .
        </h3>
      </Container>
    </Container>
  );
};
