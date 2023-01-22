import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import { Home } from "@views/home";
import { ErrorPage } from "@views/error";
import { Register } from "@views/register";
import { apiService } from "@services/api";
import { isAxiosError } from "axios";
import { RegisterLoaderData } from "@app-types/views/register";
import { Login } from "@views/login";
import { LoginLoaderData } from "@app-types/views/login";
import { HomeLoaderData } from "@app-types/views/home";
import { ServicesLoaderData } from "@app-types/views/services";
import { Service } from "@app-types/entities";
import { Services } from "@views/services";
import { uiRoutes } from "./components/navbar/routes";
import { LoadService } from "@views/load-service";
import { LoadServiceLoaderData } from "@app-types/views/load-service";
import { cloudService } from "@services/cloud-service";
import "./index.scss";
import { ForgotPassword } from "@views/forgot-password";
import { UpdatePassword } from "@views/update-password";
import { ForgotPasswordLoaderData } from "@app-types/views/forgot-password";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: uiRoutes.home,
        loader: async (): Promise<HomeLoaderData> => {
          let servicesList: Service[] | null = await cloudService.getServices();
          return { servicesList };
        },
        element: <Home />,
      },
      {
        path: uiRoutes.register,
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
        path: uiRoutes.login,
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
        path: uiRoutes.logout,
        loader: () => {
          return redirect("/");
        },
      },
      {
        path: uiRoutes.profile,
        element: <></>,
      },

      {
        path: uiRoutes.loadService + "/:id",
        loader: async ({ params }): Promise<LoadServiceLoaderData> => {
          await cloudService.getServices();
          const serviceId = params["id"] || "";
          const service = cloudService.getServiceById(serviceId);
          return { service };
        },
        element: <LoadService />,
      },

      {
        path: uiRoutes.services,
        loader: async (): Promise<ServicesLoaderData> => {
          const servicesList: Service[] | null =
            await cloudService.getServices();
          return { servicesList };
        },
        element: <Services />,
      },
      {
        path: uiRoutes.forgotPassword,
        loader: async (): Promise<ForgotPasswordLoaderData> => {
          const response = await apiService.request(
            apiService.routes.get.resetPasswordFormModel,
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
        element: <ForgotPassword />,
      },
      {
        path: uiRoutes.updatePassword,
        loader: async (): Promise<ForgotPasswordLoaderData> => {
          const response = await apiService.request(
            apiService.routes.get.updatePasswordFormModel,
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
        element: <UpdatePassword />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
