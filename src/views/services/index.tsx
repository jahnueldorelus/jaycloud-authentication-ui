import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Placeholder from "react-bootstrap/Placeholder";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Badge from "react-bootstrap/Badge";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { Link } from "react-router-dom";
import ServiceLogoPlaceholder from "@assets/service-logo-placeholder.svg";
import { Service } from "@app-types/entities";
import { ClassName } from "@services/class-name";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { uiRoutes } from "@components/navbar/routes";
import { cloudService } from "@services/cloud-service";
import { UIError } from "@components/ui-error";
import "./index.scss";

export const Services = () => {
  const loadedInitialData = useRef(false);
  const [servicesList, setServicesList] = useState<
    Service[] | null | undefined
  >(undefined);

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

  const getListOfServicesJSX = () => {
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

  /**
   * Handles opening a service.
   * @param service The service to open
   * @param event The click event
   */
  const onServiceLinkClick =
    (service: Service) => (event: MouseEvent<HTMLAnchorElement>) => {
      if (!service.available) {
        event.preventDefault();
      }
    };

  /**
   * Adds a tooltip to a service card JSX.
   * @param cardKey The key associated with each card
   * @param content The content that will activate the tooltip when hovered over
   * @param service The service information to show within the card
   * @returns
   */
  const serviceCardWithTooltip = (
    cardKey: string | number,
    content: JSX.Element,
    service?: Service
  ) => {
    if (service && !service.available) {
      return (
        <OverlayTrigger
          placement="auto"
          overlay={
            service ? (
              <Tooltip id={`tooltip-${cardKey}`}>
                {!service.available
                  ? `${service.name} is currently unavailable`
                  : ""}
              </Tooltip>
            ) : (
              <></>
            )
          }
        >
          {content}
        </OverlayTrigger>
      );
    } else {
      return content;
    }
  };

  /**
   * Creates a service card JSX.
   * @param cardKey The key associated with each card
   * @param service The service information to show within the card
   */
  const serviceCardJSX = (cardKey: string | number, service?: Service) => {
    let cardImage: string;
    let cardBodyContent: JSX.Element;

    const cardClass = new ClassName(
      "service-card mb-4 d-flex rounded border border-primary overflow-hidden"
    ).addClass(!!service && service.available, "", "disabled-card").fullClass;

    if (service) {
      cardImage =
        service && service.logo
          ? URL.createObjectURL(service.logo)
          : ServiceLogoPlaceholder;

      const cardBodyBadgeClass = new ClassName(
        "py-1 d-flex align-items-center w-fit"
      ).addClass(service.available, "bg-senary", "bg-primary").fullClass;

      cardBodyContent = (
        <Link
          to={`${uiRoutes.loadService}/${service._id}`}
          className="service-card-link p-3 d-flex text-decoration-none"
          aria-disabled={!service.available}
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

    const finalCardJSX = (
      <Card className={cardClass} border="primary" text="primary">
        <Container className="service-card-img-container py-2 px-3 bg-primary">
          <Card.Img className="service-card-img" src={cardImage} />
        </Container>
        <Card.Body className="service-card-body">{cardBodyContent}</Card.Body>
      </Card>
    );

    // Adds a tooltip if the service is unavailable

    return <Col className="d-flex justify-content-center" key={cardKey}>
      {serviceCardWithTooltip(cardKey, finalCardJSX, service)}
    </Col>;
  };

  if (servicesList || servicesList === undefined) {
    return (
      <Container className="view-services my-5">
        <h3 className="px-3 py-1 mb-4 text-white bg-primary w-fit rounded">
          Select a Service
        </h3>
        <Row lg={3}>{getListOfServicesJSX()}</Row>
      </Container>
    );
  } else {
    return (
      <Container className="my-5">
        <UIError />
      </Container>
    );
  }
};
