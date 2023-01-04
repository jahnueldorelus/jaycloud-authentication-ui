import { ServicesLoaderData } from "@app-types/views/services";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Placeholder from "react-bootstrap/Placeholder";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Badge from "react-bootstrap/Badge";
import { Link, useLoaderData } from "react-router-dom";
import ServiceLogoPlaceholder from "@assets/service-logo-placeholder.svg";
import { Service } from "@app-types/entities";
import { ClassName } from "@services/class-name";
import "./index.scss";
import React from "react";

export const Services = () => {
  const loaderData = useLoaderData() as ServicesLoaderData;

  const getListOfServicesJSX = () => {
    // Shows list of services if available
    if (loaderData.servicesList) {
      return loaderData.servicesList.map((service) => {
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

  /**
   * Handles opening a service.
   * @param service The service to open
   * @param event The click event
   */
  const onServiceLinkClick =
    (service: Service) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (!service.available) {
        event.preventDefault();
      }
    };

  const serviceCardJSX = (cardKey: string | number, service?: Service) => {
    let cardImage: string;
    let cardBodyContent: JSX.Element;

    if (service) {
      cardImage =
        service && service.logo
          ? URL.createObjectURL(service.logo)
          : ServiceLogoPlaceholder;

      const cardBodyBadgeClass = new ClassName(
        "py-1 d-flex align-items-center w-fit"
      ).addClass(service.available, "bg-senary", "bg-primary").fullClass;

      const cardBodyLinkClass = new ClassName(
        "service-card-link p-3 d-flex text-decoration-none"
      ).addClass(service.available, "", "disabled-link").fullClass;

      cardBodyContent = (
        <Link
          to={`/load-service/${service._id}`}
          className={cardBodyLinkClass}
          aria-disabled={!service.available}
          title={
            service.available ? "" : `${service.name} is currently unavailable`
          }
          onClick={onServiceLinkClick(service)}
        >
          <Container className="px-0 d-flex flex-column justify-content-between">
            <Card.Title className="text-senary" as="h4">
              {service.name}
            </Card.Title>

            <Badge className={cardBodyBadgeClass}>
              <div
                className="service-status-indicator me-1 rounded-circle"
                style={{
                  backgroundColor: service.available ? "lime" : "red",
                }}
              />
              {service.available ? "Online" : "Offline"}
            </Badge>
          </Container>
          <div className="ms-2 d-flex align-items-end align-items-md-center text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
            </svg>
          </div>
        </Link>
      );
    } else {
      cardImage = ServiceLogoPlaceholder;
      cardBodyContent = (
        <Container className="p-3">
          <Placeholder animation="glow" as={Card.Title}>
            <Placeholder xs={6} />
          </Placeholder>
          <Placeholder className="mb-0" animation="glow" as={Card.Text}>
            <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />
            <Placeholder xs={6} /> <Placeholder xs={8} />
          </Placeholder>
        </Container>
      );
    }

    return (
      <Col className="d-flex justify-content-center" key={cardKey}>
        <Card
          className="service-card mb-4 d-flex rounded border border-2 overflow-hidden"
          border="primary"
          text="primary"
        >
          <Container className="service-card-img-container py-2 px-3 bg-primary">
            <Card.Img className="service-card-img" src={cardImage} />
          </Container>
          <Card.Body className="service-card-body">{cardBodyContent}</Card.Body>
        </Card>
      </Col>
    );
  };

  return (
    <Container className="view-services my-5">
      <h3 className="px-2 py-1 mb-4 bg-primary text-white w-fit rounded">
        Select a service below
      </h3>
      <Row lg={3}>{getListOfServicesJSX()}</Row>
    </Container>
  );
};
