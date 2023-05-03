import { UserConsumer } from "@app-types/context/user";
import {
  APIUserRequestInfo,
  APIUserResponseWithData,
  UpdatePasswordRequestInfo,
  APIUserResponseWithoutData,
  PasswordResetRequestResponse,
  TokenData,
} from "@app-types/services/user";

export const initialUserContextState: UserConsumer = {
  state: {
    user: null,
    authReqProcessing: false,
    reauthorizedUserAtLeastOnce: false,
  },
  // These temporary functions will be replaced within the provider
  methods: {
    createNewUser: async (arg0: APIUserRequestInfo) =>
      ({} as APIUserResponseWithData),

    getUserFullName: (arg0: TokenData) => "",

    reauthorizeUser: async () => false,

    resetUserPassword: async (arg0: APIUserRequestInfo) =>
      ({} as PasswordResetRequestResponse),

    serviceRedirectAfterLogin: async () => {},

    serviceRedirectAfterLogout: async () => {},

    setUser: () => {},

    signInUser: async (arg0: APIUserRequestInfo) =>
      ({} as APIUserResponseWithData),

    signOutUser: async () => false,

    updateUserPassword: async (arg0: UpdatePasswordRequestInfo) =>
      ({} as APIUserResponseWithoutData),

    updateUserProfile: async (arg0: APIUserRequestInfo) =>
      ({} as APIUserResponseWithData),
  },
};
