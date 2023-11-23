import Container from "react-bootstrap/Container";
import UserIcon from "@assets/user-profile.svg";
import { useContext } from "react";
import { userContext } from "@context/user";
import Placeholder from "react-bootstrap/Placeholder";
import "./index.scss";

export const UserInfo = () => {
  const userConsumer = useContext(userContext);

  /**
   * Creates a JSX for the user's info.
   * @param label The user info property name
   * @param content The user info property value
   */
  const createUserInfoJSX = (label: string, content: string) => {
    return (
      <div className="px-sm-0 px-md-3 py-2">
        <h3 className="fs-5 text-primary" data-testid="user-info-label">
          {label}
        </h3>
        <h3 className="fs-6">{content}</h3>
      </div>
    );
  };

  if (userConsumer.state.user) {
    const user = userConsumer.state.user;
    const createdOnDate = new Date(user.createdAt);
    const createdOnText =
      createdOnDate.toLocaleDateString() +
      " " +
      createdOnDate.toLocaleTimeString();
    const email = user.email;
    const userFullName = userConsumer.methods.getUserFullName(user);

    // Displays user's info
    return (
      <Container className="view-profile-user-info px-0 py-2 d-flex flex-column flex-md-row text-senary">
        <Container className="px-0 w-fit d-flex align-items-center">
          <img className="mx-3" src={UserIcon} />
        </Container>
        <Container className="px-0 d-flex flex-wrap flex-column flex-md-row align-items-md-center">
          {createUserInfoJSX("Name", userFullName)}
          {createUserInfoJSX("Email", email)}
          {createUserInfoJSX("Created On", createdOnText)}
        </Container>
      </Container>
    );
  }
  // Displays loader
  else {
    return (
      <Container
        className="view-profile-user-info px-0 py-2 d-flex flex-column flex-md-row"
        data-testid="user-info-placeholder"
      >
        <Container className="px-0 me-md-3 w-fit d-flex align-items-center">
          <img src={UserIcon} />
        </Container>
        <Container className="px-0 mt-2 mt-md-0">
          <Placeholder animation="glow">
            <Placeholder xs={6} />
          </Placeholder>
          <Placeholder className="mb-0" animation="glow">
            <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />
            <Placeholder xs={6} /> <Placeholder xs={8} />
          </Placeholder>
        </Container>
      </Container>
    );
  }
};
