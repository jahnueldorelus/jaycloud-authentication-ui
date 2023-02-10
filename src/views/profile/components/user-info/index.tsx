import Container from "react-bootstrap/Container";
import UserIcon from "@assets/user-profile.svg";
import { userService } from "@services/user";
import { useContext } from "react";
import { userContext } from "@context/user";
import "./index.scss";

export const UserInfo = () => {
  const { user } = useContext(userContext);

  /**
   * Creates a JSX for the user's info.
   * @param label The user info property name
   * @param content The user info property value
   */
  const createUserInfoJSX = (label: string, content: string) => {
    return (
      <div className="px-sm-0 px-md-3 py-2">
        <h3 className="fs-5 text-secondary">{label}</h3>
        <h3 className="fs-6">{content}</h3>
      </div>
    );
  };

  if (user) {
    const createdOnDate = new Date(user.createdAt);
    const createdOnText =
      createdOnDate.toLocaleDateString() +
      " " +
      createdOnDate.toLocaleTimeString();
    const id = user._id;
    const email = user.email;

    return (
      <Container className="view-profile-user-info px-0 pt-4 d-flex flex-column flex-md-row text-white">
        <Container className="px-0 w-fit d-flex align-items-center">
          <img src={UserIcon} />
        </Container>
        <Container className="px-0 d-flex flex-wrap flex-column flex-md-row align-items-md-center">
          {createUserInfoJSX("Name", userService.getUserFullName(user))}
          {createUserInfoJSX("Email", email)}
          {createUserInfoJSX("Created On", createdOnText)}
          {createUserInfoJSX("User ID", id)}
        </Container>
      </Container>
    );
  } else {
    return <></>;
  }
};
