import { LoadServiceLoaderData } from "@app-types/views/load-service";
import { useLoaderData } from "react-router-dom";

export const LoadService = () => {
  const loaderData = useLoaderData() as LoadServiceLoaderData;

  if (loaderData.service) {
    return (
      <iframe
        src={`${loaderData.service.api}:${loaderData.service.portNumber}`}
        title={`${loaderData.service.name} Service`}
      />
    );
  } else {
    return <p>Failed to load service</p>;
  }
};
