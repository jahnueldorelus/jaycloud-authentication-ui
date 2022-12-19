import { authStore } from "@store/index";
import { Fragment, useContext, useState } from "react";
import JayCloudLogo from "@assets/jaycloud-logo.svg";
import UserProfile from "@assets/user-profile.svg";

export const Navbar = () => {
  const authState = useContext(authStore);
  const [isUserDropdownVisible, setUserDropdownVisible] = useState(false);

  /**
   * Click handler for the user menu options toggle.
   */
  const onUserMenuOptionsToggle = () => {
    setUserDropdownVisible(!isUserDropdownVisible);
    authState.dispatch({
      type: "userAdded",
      payload: authState.user ? null : "JDFIRE",
    });
  };

  /**
   * Retrieves the JSX for a logged in user in the user
   * menu options dropdown.
   */
  const getLoggedInUserJSX = (): JSX.Element => {
    if (authState.user) {
      return (
        <Fragment>
          <li>
            <div className="dropdown-item">
              Logged in as&nbsp;
              <span className="text-secondary">{authState.user}</span>
            </div>
          </li>
          <li>
            <a className="dropdown-item" href="#">
              Profile
            </a>
          </li>
        </Fragment>
      );
    } else {
      return <></>;
    }
  };

  /**
   * Retrieves the JSX for logging or logging out option in the user
   * menu options dropdown.
   */
  const getLoginOrLogoutJSX = (): JSX.Element => {
    return (
      <li>
        <div className="dropdown-item">
          {authState.user ? "Log Out" : "Log In"}
        </div>
      </li>
    );
  };

  return (
    <nav className="navbar py-0 bg-primary text-white">
      <div className="container">
        <div className="d-flex align-items-center">
          <a className="navbar-brand" href="#">
            <img src={JayCloudLogo} alt="JayCloud logo" width="48" />
          </a>
          <h3 className="mb-0">JayCloud</h3>
        </div>

        <ul className="navbar-nav">
          {/* User Options */}
          <li className="nav-item dropdown">
            <button
              className="nav-link p-0 rounded-circle border-0 dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded={isUserDropdownVisible}
              onClick={onUserMenuOptionsToggle}
            >
              <img src={UserProfile} alt="user profile" width="38" />
            </button>

            <ul className="dropdown-menu bg-quaternary">
              {getLoggedInUserJSX()}
              {getLoginOrLogoutJSX()}
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
};
