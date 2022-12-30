import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import { Home } from "@views/home";
import { ErrorPage } from "@views/error";
import { Register } from "@views/register";
import { apiService } from "@services/api";
import { isAxiosError } from "axios";
import { RegisterLoaderData } from "@app-types/views/register";
import "./index.scss";
import { Login } from "@views/login";
import { LoginLoaderData } from "@app-types/views/login";
import { HomeLoaderData, Service } from "@app-types/views/home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        loader: async (): Promise<HomeLoaderData> => {
          let servicesList: Service[] | null = null;

          try {
            // Retrieves the list of services
            const servicesResponse = await apiService.request(
              apiService.routes.get.services.list,
              { method: "GET" }
            );

            if (!servicesResponse || isAxiosError(servicesResponse)) {
              throw Error();
            }

            const responseList = servicesResponse.data as Service[];

            // Retrieves the logo for each service
            for (let x = 0; x < responseList.length; x++) {
              try {
                const service = responseList[x] as Service;

                const logoResponse = await apiService.request(
                  apiService.routes.get.services.logo + `/${service._id}`,
                  { method: "GET", responseType: "blob" }
                );

                if (logoResponse && !isAxiosError(logoResponse)) {
                  service.logo = logoResponse.data;
                }
              } catch (error) {
                // Does nothing if error occurs while retrieving logo. Moves on to next logo retrieval
              }
            }

            servicesList = responseList;
          } catch (error) {
            // Does nothing if error occurs retrieving list of services. List will remain unavailable
          } finally {
            return { servicesList };
          }
        },
        element: <Home />,
      },
      {
        path: "/register",
        loader: async (): Promise<RegisterLoaderData> => {
          const response = await apiService.request(
            apiService.routes.get.newUserFormModel,
            {
              method: "GET",
            }
          );

          if (!response || isAxiosError(response)) {
            return { formModel: null };
          } else {
            return { formModel: response.data };
          }
        },
        element: <Register />,
      },

      {
        path: "/login",
        loader: async (): Promise<LoginLoaderData> => {
          const response = await apiService.request(
            apiService.routes.get.authenticateUserFormModel,
            {
              method: "GET",
            }
          );

          if (!response || isAxiosError(response)) {
            return { formModel: null };
          } else {
            return { formModel: response.data };
          }
        },
        element: <Login />,
      },
      {
        path: "/profile",
        element: <Home />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
