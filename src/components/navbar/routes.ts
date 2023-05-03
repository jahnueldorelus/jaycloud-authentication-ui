const uiRoutes = {
  home: "/",
  register: "",
  login: "",
  logout: "",
  loggedOutUserSSORedirect: "",
  logoutError: "",
  forgotPassword: "",
  updatePassword: "",
  profile: "",
  loadService: "",
  services: "",
  ssoFailed: "",
};

uiRoutes.register = uiRoutes.home + "register";
uiRoutes.login = uiRoutes.home + "login";
uiRoutes.logout = uiRoutes.home + "logout";
uiRoutes.loggedOutUserSSORedirect = uiRoutes.home + "logout-sso";
uiRoutes.logoutError = uiRoutes.home + "logout-error";
uiRoutes.forgotPassword = uiRoutes.home + "forgot-password";
uiRoutes.updatePassword = uiRoutes.home + "update-password";
uiRoutes.profile = uiRoutes.home + "profile";
uiRoutes.services = uiRoutes.home + "services";
uiRoutes.ssoFailed = uiRoutes.home + "sso-failed";

const uiSearchParams = {
  sso: "sso",
};

export { uiRoutes, uiSearchParams };
