import { UserProvider } from "@context/user";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

export const testDataIds = {
  appUiError: "app-ui-error",
  appLoader: "app-loader",
  appError: {
    card: "app-error-card",
    title: "app-error-title",
    message: "app-error-message",
  },
};

/**
 * Wraps an element with the router provider to where the default
 * page is the element provided in the function.
 * @param jsx The element to wrap the router provider with
 */
export const addRouterProvider = (jsx: JSX.Element) => {
  const router = createBrowserRouter([{ path: "/", element: jsx }]);
  return <RouterProvider router={router} />;
};

/**
 * Wraps an element with the user provider to where the default
 * page is the element provided in the function.
 * @param jsx The element to wrap the router provider with
 */
export const addUserProvider = (jsx: JSX.Element) => {
  return <UserProvider>{jsx}</UserProvider>;
};
