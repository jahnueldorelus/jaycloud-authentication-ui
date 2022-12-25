import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import { Home } from "@views/home";
import { ErrorPage } from "@views/error";
import { Register } from "@views/register";
import { apiService } from "@services/api";
import { isAxiosError } from "axios";
import { RegisterActionData, RegisterLoaderData } from "@app-types/register";
import "./index.scss";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
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
        element: <Home />,
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
