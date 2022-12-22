import { authStore } from "@store/index";
import { Fragment, useContext, useState } from "react";
import JayCloudLogo from "@assets/jaycloud-logo.svg";
import UserProfile from "@assets/user-profile.svg";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Dropdown from "react-bootstrap/Dropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import CloseButton from "react-bootstrap/CloseButton";
import { NavLink } from "react-router-dom";
import "./index.scss";

export const AppNavbar = () => {
  const mobileNavId = "app-navigation-mobile";
  const desktopUserMenuId = "app-navigation-desktop-user-menu";
  const authState = useContext(authStore);
  const [isUserDropdownVisible, setIsUserDropdownVisible] = useState(false);
  const [isOffcanvasVisible, setIsOffcanvasVisible] = useState(false);

  /**
   * Click handler for the user menu options toggle.
   */
  const onUserMenuOptionsToggle = (willMenuShow: boolean) => {
    setIsUserDropdownVisible(willMenuShow);
  };

  /**
   * Click handler for the mobile menu toggle.
   */
  const onMobileMenuToggle = () => {
    setIsOffcanvasVisible(!isOffcanvasVisible);
  };

  /**
   * Retrieves the JSX for the user profile image.
   */
  const getUserProfileImgJSX = () => {
    return <img src={UserProfile} alt="user profile" width="38" />;
  };

  /**
   * Retrieves the JSX for a logged in user in the user
   * menu options dropdown.
   */
  const loggedInUserDropdownOptions = (): JSX.Element => {
    if (authState.user) {
      return (
        <Fragment>
          <li className="mb-0 py-2 px-2 text-white">
            Logged in as
            <br />
            <span className="text-secondary">
              <strong>{authState.user}</strong>
            </span>
          </li>

          <Dropdown.Divider className="mx-2 bg-white" />

          <li>
            <NavLink to="/profile">
              <Dropdown.Item className="mb-1 fs-5" as="h2">
                Profile
              </Dropdown.Item>
            </NavLink>
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
  const loginOrLogoutDropdownOption = (): JSX.Element => {
    return (
      <li>
        <NavLink to={authState.user ? "/logout" : "/login"}>
          <Dropdown.Item className="m-0 fs-5" as="h2">
            {authState.user ? "Log Out" : "Log In"}
          </Dropdown.Item>
        </NavLink>
      </li>
    );
  };

  return (
    <Navbar className="app-navbar p-0 mb-3" bg="primary" expand="md">
      <Container className="flex-row-reverse flex-md-row" fluid="md">
        <Navbar.Brand className="d-flex text-white fs-3" href="#Home">
          <img
            className="me-3"
            src={JayCloudLogo}
            alt="JayCloud logo"
            width="40"
          />
          <h1 className="m-0 fs-2">JayCloud</h1>
        </Navbar.Brand>

        {/* Mobile navigation */}
        <Navbar.Toggle
          className="px-2 bg-senary"
          onClick={onMobileMenuToggle}
          aria-controls={mobileNavId}
        />

        <Offcanvas
          backdropClassName="bg-primary"
          id={mobileNavId}
          placement="start"
          show={isOffcanvasVisible}
          onHide={onMobileMenuToggle}
        >
          <Offcanvas.Header className="pb-2 align-items-start bg-senary text-white">
            <Container className="p-0 me-4">
              {getUserProfileImgJSX()}
              <Offcanvas.Title className="mt-2">
                Logged in as
                <br />
                <span className="text-secondary">
                  <strong>{authState.user}</strong>
                </span>
              </Offcanvas.Title>
            </Container>
            <CloseButton
              className="m-0 bg-light"
              variant="white"
              aria-aria-label="Close navigation menu"
              onClick={onMobileMenuToggle}
            />
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav onSelect={onMobileMenuToggle} as="ul">
              <Nav.Item className="py-1 px-2 fs-5" as="li">
                <NavLink to="/">Home</NavLink>
              </Nav.Item>
              <Nav.Item className="py-1 px-2 fs-5" as="li">
                <NavLink to="/profile">Profile</NavLink>
              </Nav.Item>
              <Nav.Item className="py-1 px-2 fs-5" as="li">
                <NavLink to={authState.user ? "/logout" : "/login"}>
                  {authState.user ? "Logout" : "Login"}
                </NavLink>
              </Nav.Item>
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>

        {/* Desktop Navigation */}
        <Nav className="d-none d-md-flex flex-row">
          <Nav.Item className="d-flex align-items-center">
            <NavLink to="/" className="fs-5">
              <Nav.Link className="m-0" as="h2">
                Home
              </Nav.Link>
            </NavLink>
          </Nav.Item>

          <Dropdown
            className="ms-4 d-flex align-items-center"
            onToggle={onUserMenuOptionsToggle}
            as={Nav.Item}
          >
            <Dropdown.Toggle
              className="p-0 bg-transparent d-flex align-items-center rounded-circle border-0"
              aria-expanded={isUserDropdownVisible}
              aria-controls={desktopUserMenuId}
            >
              {getUserProfileImgJSX()}
            </Dropdown.Toggle>

            <Dropdown.Menu
              className="user-dropdown-menu bg-senary p-2 overflow-hidden"
              id={desktopUserMenuId}
              align="end"
              as="ul"
            >
              {loggedInUserDropdownOptions()}
              {loginOrLogoutDropdownOption()}
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};
