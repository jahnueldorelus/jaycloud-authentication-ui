import { LoadServiceLoaderData } from "@app-types/views/load-service";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import { Fragment, useState } from "react";
import { useLoaderData } from "react-router-dom";
import "./index.scss";

export const LoadService = () => {
  const loaderData = useLoaderData() as LoadServiceLoaderData;
  const [iframeLoading, setIframeLoading] = useState(true);
  const [iframeClass, setIframeClass] = useState("d-none");

  /**
   * Handles the iframe loading it's source's content.
   */
  const onIframeLoad = () => {
    setIframeLoading(false);
    setIframeClass("d-inline");
  };

  if (loaderData.service) {
    return (
      <Fragment>
        {iframeLoading && (
          <Container
            className="service-iframe-loader bg-tertiary text-primary d-flex flex-column justify-content-center align-items-center"
            fluid
          >
            <Spinner className="loading-spinner" animation="grow" />
            <p className="mt-3 text-center fs-3">
              Loading Service:
              <span className="d-block text-senary fs-2">
                {loaderData.service.name}
              </span>
            </p>
          </Container>
        )}
        <iframe
          className={iframeClass}
          src={`${loaderData.service.api}:${loaderData.service.portNumber}`}
          title={`${loaderData.service.name} Service`}
          onLoad={onIframeLoad}
          height="100%"
          width="100%"
        />
      </Fragment>
    );
  } else {
    return <p>Failed to load service</p>;
  }
};
