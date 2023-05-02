import { uiRoutes, uiSearchParams } from "@components/navbar/routes";
import { userContext } from "@context/user";
import { useContext } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type AuthenticatedViewProps = {
  children: JSX.Element;
};

export const AuthenticatedView = (props: AuthenticatedViewProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(userContext);
  console.log(user)

  /**
   * Detects changes to the user's authentication status and sets the route
   * to navigate to after the user authenticates successfully.
   */
  useEffect(() => {
    if (!user) {
      navigate({
        pathname: uiRoutes.login,
        search: new URLSearchParams({
          [uiSearchParams.viewAfterAuth]: location.pathname,
        }).toString(),
      });
    }
  }, [user]);

  return props.children;
};
