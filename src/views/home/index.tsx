import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Placeholder from "react-bootstrap/Placeholder";
import JayCloudHub from "@assets/jaycloud-home-hub.svg";
import { NavLink } from "react-router-dom";
import ServiceLogoPlaceholder from "@assets/service-logo-placeholder.svg";
import { Fragment, useEffect, useState, useRef, useContext } from "react";
import { Service } from "@app-types/entities";
import { uiRoutes } from "@components/navbar/routes";
import { cloudService } from "@services/cloud-service";
import { userContext } from "@context/user";
import "./index.scss";

export const Home = () => {
  const [servicesList, setServicesList] = useState<Service[] | null>(null);
  const loadedInitialData = useRef(false);
  const userConsumer = useContext(userContext);

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
          <Card.Title
            className="text-senary"
            as="h4"
            data-testid="service-card-title"
          >
            {service.name}
          </Card.Title>
          <Card.Text>{service.description}</Card.Text>
        </Fragment>
      );
    } else {
      cardImage = ServiceLogoPlaceholder;
      cardBodyContent = (
        <Fragment>
          <Placeholder
            animation="glow"
            as={Card.Title}
            data-testid="placeholder-card-title"
          >
            <Placeholder xs={6} />
          </Placeholder>
          <Placeholder animation="glow" as={Card.Text}>
            <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />
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
      <div className="section-one px-0 pt-5 bg-primary">
        <Container className="text-white d-flex flex-column flex-md-row align-items-center">
          <div className="px-3 px-sm-0 w-100">
            <h2 className="text-secondary">JayCloud Services Hub</h2>
            <h3 className="fs-4">
              A central location of JayCloud services for day-to-day operations.
              No need to dig into your emails, letters, and notes trying to
              manage or find your personal information. Make life easier without
              any hassle with JayCloud. Our website is your one-stop solution to
              streamline your daily tasks. With our exclusive linked
              applications, you can manage your finances, read songbooks, and
              even track your health.
            </h3>
          </div>
          <div className="px-5 pt-5 pt-md-0 w-fit d-flex justify-content-center">
            <img src={JayCloudHub} alt="JayCloud service hub" width="500" />
          </div>
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
      </div>

      <h3 className="pt-5 text-senary text-center fs-1">JayCloud Services</h3>

      <Container className="py-5" fluid>
        <Container>
          <Row className="g-2" md={2} lg={3}>
            {serviceCardsListJSX()}
          </Row>
        </Container>
      </Container>

      {!userConsumer.state.user && (
        <Container className="pb-2 bg-tertiary" fluid>
          <div className="section-three-divider">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 0 2 1">
              <path
                className="shape-fill"
                d="M 0 0 L 0 0 H 1 L 0 1 L -1 0 H 0"
              />
            </svg>
          </div>
          <h3 className="py-5 mb-0 text-center">
            To get started, create an&nbsp;
            <NavLink
              className="text-senary"
              to={uiRoutes.register}
              aria-label="create a new account"
            >
              account
            </NavLink>
            &nbsp;or&nbsp;
            <NavLink
              className="text-senary"
              to={uiRoutes.login}
              aria-label="login to your account"
            >
              login
            </NavLink>
            .
          </h3>
        </Container>
      )}
    </Container>
  );
};
