import { createContext, useReducer } from "react";

type AuthState = {
  accessToken: string | null;
  tokensFetchFailed: boolean;
  requestLoading: boolean;
  requestFailedMessage: string | null;
  user: User | null;
  dispatch: React.Dispatch<AuthAction>;
};

type User = string;

type StoreAction<T extends string, K> = { type: T; payload: K };
type AuthAction =
  | StoreAction<"userAdded", any>
  | StoreAction<"refAndAccTokensAdded", any>
  | StoreAction<"requestFailed", any>
  | StoreAction<"resetRequestFailed", any>
  | StoreAction<"userRemoved", any>
  | StoreAction<"requestStarted", any>
  | StoreAction<"requestFinished", any>;

type AuthProviderProps = {
  children: JSX.Element;
};

const initialState: AuthState = {
  accessToken: null,
  requestFailedMessage: null,
  requestLoading: false,
  tokensFetchFailed: false,
  user: null,
  dispatch: () => {}, // Temporary function that will be replaced
};
const store = createContext(initialState);
const { Provider } = store;

const AuthProvider = (props: AuthProviderProps) => {
  /**
   * Creates a deep copy of the reducer's state.
   * @param state The state to copy
   */
  const makeStateCopy = (state: AuthState) => {
    return { ...state };
  };

  const reducer: React.Reducer<AuthState, AuthAction> = (
    state: AuthState,
    action: AuthAction
  ) => {
    switch (action.type) {
      // Adds the user's refresh and access tokens
      case "refAndAccTokensAdded":
        return state;

      // Sets the authentication request status as failed
      case "requestFailed":
        return state;

      // Sets the authentication request status as completed
      case "requestFinished":
        return state;

      // Sets the authentication request status as started
      case "requestStarted":
        return state;

      // Resets the authentication request status
      case "resetRequestFailed":
        return state;

      // Adds a new user
      case "userAdded":
        const newState = makeStateCopy(state);
        newState.user = action.payload;
        return newState;

      // Removes the user
      case "userRemoved":
        return state;

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  return <Provider value={{ ...state, dispatch }}>{props.children}</Provider>;
};

export { store as authStore, AuthProvider };
