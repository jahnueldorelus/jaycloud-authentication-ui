import { Fragment, useState } from "react";
import JayCloudLogo from "@assets/jaycloud-logo.svg";
import UserProfile from "@assets/user-profile.svg";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Dropdown from "react-bootstrap/Dropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import CloseButton from "react-bootstrap/CloseButton";
import { NavLink } from "react-router-dom";
import { userService } from "@services/user";
import { uiRoutes } from "@components/navbar/routes";
import { useContext } from "react";
import { userContext } from "@context/user";
import "./index.scss";

export const AppNavbar = () => {
  const mobileNavId = "app-navigation-mobile";
  const desktopUserMenuId = "app-navigation-desktop-user-menu";
  const [isUserDropdownVisible, setIsUserDropdownVisible] = useState(false);
  const [isOffcanvasVisible, setIsOffcanvasVisible] = useState(false);
  const { user } = useContext(userContext);

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
   * Creates an offcanvas nav item.
   * @param itemLink The path to link the nav item to
   * @param itemName The name of the nav item
   */
  const createOffCanvasNavItem = (itemLink: string, itemName: string) => {
    return (
      <Nav.Item className="py-1 px-2 fs-5" as="li">
        <NavLink to={itemLink} onClick={onMobileMenuToggle}>
          {itemName}
        </NavLink>
      </Nav.Item>
    );
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
  const loggedInUserDropdownInfo = (): JSX.Element => {
    if (user) {
      return (
        <Fragment>
          <li className="mb-0 py-2 px-2 text-white">
            Logged in as
            <br />
            <span className="text-secondary">
              <strong>{userService.getUserFullName(user)}</strong>
            </span>
          </li>

          <Dropdown.Divider className="mx-2 bg-white" />
        </Fragment>
      );
    } else {
      return <></>;
    }
  };

  /**
   * Retrieves the JSX for a logged in user in the user
   * menu options dropdown.
   */
  const loggedInUserOffCanvasInfo = (): JSX.Element => {
    return (
      <Offcanvas.Header className="pb-2 align-items-start bg-senary text-white">
        <Container className="p-0 me-4">
          {getUserProfileImgJSX()}
          <Offcanvas.Title className="mt-2">
            {user ? "Logged in as" : "Not logged in"}
            <br />
            {user && (
              <span className="text-secondary">
                <strong>{userService.getUserFullName(user)}</strong>
              </span>
            )}
          </Offcanvas.Title>
        </Container>
        <CloseButton
          className="m-0 bg-light"
          variant="white"
          aria-label="Close navigation menu"
          onClick={onMobileMenuToggle}
        />
      </Offcanvas.Header>
    );
  };

  return (
    <Navbar className="app-navbar py-1" bg="primary" expand="md">
      <Container className="flex-row-reverse flex-md-row" fluid="md">
        <Navbar.Brand>
          <NavLink
            className="me-0 d-flex align-items-center text-white text-decoration-none fs-3"
            to={uiRoutes.home}
          >
            <img
              className="me-3"
              src={JayCloudLogo}
              alt="JayCloud logo"
              width="40"
            />
            <h1 className="m-0 fs-2">JayCloud</h1>
          </NavLink>
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
          {loggedInUserOffCanvasInfo()}
          <Offcanvas.Body>
            <Nav onSelect={onMobileMenuToggle} as="ul">
              {createOffCanvasNavItem(uiRoutes.home, "Home")}
              {createOffCanvasNavItem(uiRoutes.services, "Services")}
              {createOffCanvasNavItem(uiRoutes.profile, "Profile")}
              {createOffCanvasNavItem(
                user ? uiRoutes.logout : uiRoutes.login,
                user ? "Logout" : "Login"
              )}
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>

        {/* Desktop Navigation */}
        <Nav className="d-none d-md-flex flex-row">
          <Nav.Item className="d-flex align-items-center">
            <NavLink className="px-2 py-1 fs-5" to={uiRoutes.home}>
              Home
            </NavLink>
          </Nav.Item>
          <Nav.Item className="d-flex align-items-center">
            <NavLink className="px-2 py-1 ms-3 fs-5" to={uiRoutes.services}>
              Services
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
              {loggedInUserDropdownInfo()}
              <li>
                <NavLink to={uiRoutes.profile}>
                  <Dropdown.Item className="py-2 mb-1 fs-5" as="h2">
                    Profile
                  </Dropdown.Item>
                </NavLink>
              </li>
              <li>
                <NavLink to={user ? uiRoutes.logout : uiRoutes.login}>
                  <Dropdown.Item className="py-2 m-0 fs-5" as="h2">
                    {user ? "Log Out" : "Log In"}
                  </Dropdown.Item>
                </NavLink>
              </li>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Container>
    </Navbar>
  );
};
