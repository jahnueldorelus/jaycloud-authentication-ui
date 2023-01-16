const uiRoutes = {
  home: "/",
  register: "",
  login: "",
  logout: "",
  passwordReset: "",
  profile: "",
  loadService: "",
  services: "",
};

uiRoutes.register = uiRoutes.home + "register";
uiRoutes.login = uiRoutes.home + "login";
uiRoutes.logout = uiRoutes.home + "logout";
uiRoutes.passwordReset = uiRoutes.home + "password-reset";
uiRoutes.profile = uiRoutes.home + "profile";
uiRoutes.loadService = uiRoutes.home + "load-service";
uiRoutes.services = uiRoutes.home + "services";

export { uiRoutes };
