import { UserConsumer, UserProviderProps } from "@app-types/context/user";
import {
  APIUserRequestInfo,
  APIUserResponseWithData,
  UpdatePasswordRequestInfo,
  APIUserResponseWithoutData,
  PasswordResetRequestResponse,
  TokenData,
} from "@app-types/services/user";
import { userService } from "@services/user";
import { createContext, useEffect, useRef, useState } from "react";
import { initialUserContextState } from "@context/user/initial-state";

const context = createContext(initialUserContextState);
const { Provider } = context;

const UserProvider = (props: UserProviderProps) => {
  // The user's info
  const [user, setUser] = useState<TokenData | null>(null);

  // Determines if an authentication request is processing
  const [authReqProcessing, setAuthReqProcessing] = useState<boolean>(false);

  // Determines if a request to reauthorize the user has been attempted
  const attemptedToReauthorizeUser = useRef<boolean>(false);

  // Reauthenticates the user upon first load
  useEffect(() => {
    if (!attemptedToReauthorizeUser.current) {
      attemptedToReauthorizeUser.current = true;
      reauthorizeUser();
    }
  }, []);

  /**
   * Attempts to create a user.
   * @param requestData The data to send along with the request
   */
  const createNewUser = async (
    requestData: APIUserRequestInfo
  ): Promise<APIUserResponseWithData> => {
    setAuthReqProcessing(true);
    const result = await userService.createUser(requestData);
    setUser(result.data);
    setAuthReqProcessing(false);

    return result;
  };

  /**
   * Attempts to sign in the user.
   * @param requestData The data to send along with the request
   */
  const signInUser = async (
    requestData: APIUserRequestInfo
  ): Promise<APIUserResponseWithData> => {
    setAuthReqProcessing(true);
    const result = await userService.authenticateUser(requestData);
    setUser(result.data);
    setAuthReqProcessing(false);

    return result;
  };

  /**
   * Attempts to sign out the user.
   */
  const signOutUser = async (): Promise<boolean> => {
    setAuthReqProcessing(true);

    const userSignedOut = await userService.logoutUser();

    setAuthReqProcessing(false);

    if (userSignedOut) {
      setUser(null);
      return true;
    }

    return false;
  };

  /**
   * Attempts to reauthenticate the user.
   */
  const reauthorizeUser = async (): Promise<boolean> => {
    if (!attemptedToReauthorizeUser.current) {
      attemptedToReauthorizeUser.current = true;
    }

    setAuthReqProcessing(true);

    const userData = await userService.getUserReauthorized();

    setUser(userData);
    setAuthReqProcessing(false);

    return userData ? true : false;
  };

  /**
   * Attempts to reset a user's password.
   * @param requestData The data to send along with the request
   */
  const resetUserPassword = async (
    requestData: APIUserRequestInfo
  ): Promise<PasswordResetRequestResponse> => {
    setAuthReqProcessing(true);
    const result = await userService.resetPassword(requestData);
    setAuthReqProcessing(false);

    return result;
  };

  /**
   * Attempts to update the user's password.
   * @param requestData The data to send along with the request
   */
  const updateUserPassword = async (
    requestData: UpdatePasswordRequestInfo
  ): Promise<APIUserResponseWithoutData> => {
    setAuthReqProcessing(true);
    const result = await userService.updatePassword(requestData);
    setAuthReqProcessing(false);

    return result;
  };

  /**
   * Attempts to update the user's profile.
   * @param requestData The data to send along with the request
   */
  const updateUserProfile = async (
    requestData: APIUserRequestInfo
  ): Promise<APIUserResponseWithData> => {
    setAuthReqProcessing(true);
    const result = await userService.updateProfile(requestData);
    setUser(result.data);
    setAuthReqProcessing(false);

    return result;
  };

  /**
   * Redirects the user to the previous service they were on if they
   * initially requested to sign in from another service.
   */
  const serviceRedirectAfterLogin = async (): Promise<void> => {
    await userService.redirectToPreviousService();
  };

  /**
   * Redirects the user to the previous service they were on if they
   * initially requested to sign out from another service.
   */
  const serviceRedirectAfterLogout = async (): Promise<void> => {
    await userService.loggedOutUserSSORedirect();
  };

  /**
   * Retrieves the full name of a user.
   * @param user The user's info
   */
  const getUserFullName = (user: TokenData) => {
    return (user.firstName + " " + user.lastName).replace(
      /\w\S*/g,
      (word) =>
        word.charAt(0).toLocaleUpperCase() +
        word.substring(1).toLocaleLowerCase()
    );
  };

  const providerValue: UserConsumer = {
    state: {
      user,
      authReqProcessing,
      reauthorizedUserAtLeastOnce: attemptedToReauthorizeUser.current,
    },
    methods: {
      setUser,
      createNewUser,
      signInUser,
      signOutUser,
      reauthorizeUser,
      serviceRedirectAfterLogin,
      serviceRedirectAfterLogout,
      resetUserPassword,
      updateUserPassword,
      updateUserProfile,
      getUserFullName,
    },
  };

  return <Provider value={providerValue} children={props.children} />;
};

export { context as userContext, UserProvider };
