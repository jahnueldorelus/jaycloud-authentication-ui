const uiRoutes = {
  home: "/",
  register: "",
  login: "",
  logout: "",
  forgotPassword: "",
  updatePassword: "",
  profile: "",
  loadService: "",
  services: "",
};

uiRoutes.register = uiRoutes.home + "register";
uiRoutes.login = uiRoutes.home + "login";
uiRoutes.logout = uiRoutes.home + "logout";
uiRoutes.forgotPassword = uiRoutes.home + "forgot-password";
uiRoutes.updatePassword = uiRoutes.home + "update-password";
uiRoutes.profile = uiRoutes.home + "profile";
uiRoutes.loadService = uiRoutes.home + "load-service";
uiRoutes.services = uiRoutes.home + "services";

const uiSearchParams = {
  viewAfterAuth: "viewAfterAuth",
};

export { uiRoutes, uiSearchParams };
