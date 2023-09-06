import { UserProvider, userContext } from "@context/user";
import { initialUserContextState } from "@context/user/initial-state";
import userEvent from "@testing-library/user-event";
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
 * @param addFakeUser Determines if fake user data should be added
 */
export const addUserProvider = (jsx: JSX.Element, addFakeUser?: boolean) => {
  if (addFakeUser) {
    const UserProviderWithUserInfo = userContext.Provider;
    return (
      <UserProviderWithUserInfo
        value={{
          ...initialUserContextState,
          state: {
            ...initialUserContextState.state,
            user: {
              createdAt: new Date().toString(),
              email: "test@email.com",
              firstName: "test-firstname",
              lastName: "test-lastname",
            },
          },
        }}
        children={jsx}
      />
    );
  } else {
    return <UserProvider>{jsx}</UserProvider>;
  }
};

/**
 * Sets up the user event to add a delay due to an unexplainable
 * error that occurs if there's no delay setup when typing into an input.
 */
export const domUser = userEvent.setup({ delay: 100 });
