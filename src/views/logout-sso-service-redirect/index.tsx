import { uiRoutes } from "@components/navbar/routes";
import { userContext } from "@context/user";
import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export const LogoutSSOServiceRedirect = () => {
  const userConsumer = useContext(userContext);
  const navigate = useNavigate();
  const attemptedRedirect = useRef(false);

  useEffect(() => {
    if (!attemptedRedirect.current) {
      attemptedRedirect.current = true;
      redirectBackToService();
    }
  }, []);

  /**
   * Redirects the user to the previous service they were using
   * if they initially requested to signout from a service.
   */
  const redirectBackToService = async () => {
    await userConsumer.methods.serviceRedirectAfterLogout();

    // If the user wasn't redirected back to a service, they're sent to the login page
    navigate(uiRoutes.login);
  };

  return <></>;
};
