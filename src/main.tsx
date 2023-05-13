import React, { Fragment } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import { Home } from "@views/home";
import { ErrorPage } from "@views/error";
import { Register } from "@views/register";
import { Login } from "@views/login";
import { Services } from "@views/services";
import { uiRoutes } from "./components/navbar/routes";
import { ForgotPassword } from "@views/forgot-password";
import { UpdatePassword } from "@views/update-password";
import { UserProvider } from "@context/user";
import { AuthenticatedView } from "@components/authenticated-view";
import { Profile } from "@views/profile";
import { SSOFailed } from "@views/sso-failed";
import { LogoutError } from "@views/logout-error";
import { Logout } from "@views/logout";
import { LogoutSSOServiceRedirect } from "@views/logout-sso-service-redirect";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Seo } from "@components/seo";
import "./index.scss";

/**
 * Creates the title that will appear in the head meta tag
 */
const createTitle = (text: string) => {
  return `${text} - JayCloud`;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: uiRoutes.home,
        element: (
          <Fragment>
            <Seo
              indexPage={true}
              title="Home"
              description="A central location of JayCloud services for day to day operations. Access your information in one place!"
              canonicalPathname={uiRoutes.home}
            />

            <Home />
          </Fragment>
        ),
      },
      {
        path: uiRoutes.register,
        element: (
          <Fragment>
            <Seo
              indexPage={true}
              title="Create a New Account"
              description="Welcome to our sign-up page! Create your account now and enjoy exclusive access to our services. It'll take less than a minute."
              canonicalPathname={uiRoutes.register}
            />

            <Register />
          </Fragment>
        ),
      },

      {
        path: uiRoutes.login,
        element: (
          <Fragment>
            <Seo
              indexPage={true}
              title="Login"
              description="Log in to your account to access our exclusive features and services. Stay up-to-date and manage your information easily!"
              canonicalPathname={uiRoutes.login}
            />

            <Login />
          </Fragment>
        ),
      },
      {
        path: uiRoutes.logout,
        element: (
          <Fragment>
            <Seo
              indexPage={false}
              title="Logout"
              description="Goodbye for now! Logging out of your account. Come back soon and enjoy our exclusive services and features!"
              canonicalPathname={uiRoutes.logout}
            />

            <Logout />
          </Fragment>
        ),
      },
      {
        path: uiRoutes.loggedOutUserSSORedirect,
        element: (
          <Fragment>
            <Seo
              indexPage={false}
              title="Logout"
              description="
              Thank you for your visit. You will now return to one of our services if you logged out from one."
              canonicalPathname={uiRoutes.loggedOutUserSSORedirect}
            />

            <LogoutSSOServiceRedirect />
          </Fragment>
        ),
      },
      {
        path: uiRoutes.logoutError,
        element: (
          <Fragment>
            <Helmet>
              <title>{createTitle("Error Logging Out")}</title>
            </Helmet>
            <Seo
              indexPage={false}
              title="Error Logging Out"
              description="We're sorry, an error occurred while logging you out. Please try again later or contact customer support for assistance."
              canonicalPathname={uiRoutes.logoutError}
            />

            <LogoutError />
          </Fragment>
        ),
      },
      {
        path: uiRoutes.profile,
        element: (
          <Fragment>
            <Seo
              indexPage={true}
              title="Profile"
              description="Manage your account with ease! View and edit your profile information here. Keep everything updated."
              canonicalPathname={uiRoutes.profile}
            />

            <AuthenticatedView>
              <Profile />
            </AuthenticatedView>
          </Fragment>
        ),
      },
      {
        path: uiRoutes.services,
        element: (
          <Fragment>
            <Seo
              indexPage={true}
              title="Services"
              description="Explore our exclusive services! Browse through our selection and select the perfect one for your needs."
              canonicalPathname={uiRoutes.services}
            />

            <Services />
          </Fragment>
        ),
      },
      {
        path: uiRoutes.forgotPassword,
        element: (
          <Fragment>
            <Seo
              indexPage={true}
              title="Password Reset"
              description="Forgot your password? No worries! Reset it easily by confirming your identity and following the instructions."
              canonicalPathname={uiRoutes.forgotPassword}
            />

            <ForgotPassword />
          </Fragment>
        ),
      },
      {
        path: uiRoutes.updatePassword,
        element: (
          <Fragment>
            <Seo
              indexPage={false}
              title="Update Password"
              description="Reset your password with ease on our website. Follow the instructions to access your account again."
              canonicalPathname={uiRoutes.updatePassword}
            />

            <UpdatePassword />
          </Fragment>
        ),
      },
      {
        path: uiRoutes.ssoFailed,
        element: (
          <Fragment>
            <Seo
              indexPage={false}
              title="Error Logging In"
              description="Sorry, we couldn't log you in at the moment. Contact support for help."
              canonicalPathname={uiRoutes.updatePassword}
            />

            <SSOFailed />
          </Fragment>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <HelmetProvider>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </HelmetProvider>
  </React.StrictMode>
);
