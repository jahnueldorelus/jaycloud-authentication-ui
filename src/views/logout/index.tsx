import { uiRoutes } from "@components/navbar/routes";
import { userContext } from "@context/user";
import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export const Logout = () => {
  const navigate = useNavigate();
  const userConsumer = useContext(userContext);
  const attemptedUserLogout = useRef(false);

  useEffect(() => {
    if (!attemptedUserLogout.current) {
      attemptedUserLogout.current = true;
      logoutUser();
    }
  }, []);

  /**
   * Attempts to log out the user.
   */
  const logoutUser = async () => {
    const userSignedOut = await userConsumer.methods.signOutUser();

    if (userSignedOut) {
      navigate(uiRoutes.loggedOutUserSSORedirect);
    } else {
      navigate(uiRoutes.logoutError);
    }
  };

  return <></>;
};
