import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import { Home } from "@views/home";
import { ErrorPage } from "@views/error";
import { Register } from "@views/register";
import { Login } from "@views/login";
import { Services } from "@views/services";
import { uiRoutes } from "./components/navbar/routes";
import { LoadService } from "@views/load-service";
import { LoadServiceLoaderData } from "@app-types/views/load-service";
import { cloudService } from "@services/cloud-service";
import { ForgotPassword } from "@views/forgot-password";
import { UpdatePassword } from "@views/update-password";
import { UserProvider } from "@context/user";
import { AuthenticatedView } from "@components/authenticated-view";
import { Profile } from "@views/profile";
import { SSOFailed } from "@views/sso-failed";
import { LogoutError } from "@views/logout-error";
import "./index.scss";
import { Logout } from "@views/logout";
import { LogoutSSOServiceRedirect } from "@views/logout-sso-service-redirect";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: uiRoutes.home,
        element: <Home />,
      },
      {
        path: uiRoutes.register,
        element: <Register />,
      },

      {
        path: uiRoutes.login,
        element: <Login />,
      },
      {
        path: uiRoutes.logout,
        element: <Logout />,
      },
      {
        path: uiRoutes.loggedOutUserSSORedirect,
        element: <LogoutSSOServiceRedirect />,
      },
      {
        path: uiRoutes.logoutError,
        element: <LogoutError />,
      },
      {
        path: uiRoutes.profile,
        element: (
          <AuthenticatedView>
            <Profile />
          </AuthenticatedView>
        ),
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
        element: <Services />,
      },
      {
        path: uiRoutes.forgotPassword,
        element: <ForgotPassword />,
      },
      {
        path: uiRoutes.updatePassword,
        element: <UpdatePassword />,
      },
      {
        path: uiRoutes.ssoFailed,
        element: <SSOFailed />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </React.StrictMode>
);
