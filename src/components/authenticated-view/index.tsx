import { uiRoutes } from "@components/navbar/routes";
import { userContext } from "@context/user";
import { useContext } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import { Loader } from "@components/loader";
import { sessionStorageService } from "@services/session-storage";

type AuthenticatedViewProps = {
  children: JSX.Element;
};

export const AuthenticatedView = (props: AuthenticatedViewProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const userConsumer = useContext(userContext);

  /**
   * Detects changes to the user's authentication status and determines if
   * the user should be sent to the login page to authenticate themselves.
   */
  useEffect(() => {
    if (
      !userConsumer.state.user &&
      !userConsumer.state.authReqProcessing &&
      userConsumer.state.reauthorizedUserAtLeastOnce
    ) {
      sessionStorageService.setViewBeforeAuth(location.pathname);
      navigate(uiRoutes.login);
    }
  }, [userConsumer.state.user, userConsumer.state.authReqProcessing]);

  if (userConsumer.state.user) {
    return props.children;
  } else {
    return (
      <Container className="py-5 d-flex align-items-center">
        <Loader />
      </Container>
    );
  }
};
