import {
  UserState,
  UserProviderProps,
  UserActions,
} from "@app-types/context/user";
import { objectService } from "@services/object";
import { createContext, useReducer } from "react";

const initialState: UserState = {
  user: null,
  // Temporary function that will be replaced
  userDispatch: () => {},
};

const context = createContext(initialState);
const { Provider } = context;

const UserProvider = (props: UserProviderProps) => {
  const reducer: React.Reducer<UserState, UserActions> = (
    state: UserState,
    action: UserActions
  ) => {
    // Sets the user's info
    if (action.type === "setUser") {
      const newState = objectService.shallowClone(state);
      newState.user = action.payload;
      return newState;
    }

    // Returns the original state
    else {
      return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Provider
      value={{ ...state, userDispatch: dispatch }}
      children={props.children}
    />
  );
};

export { context as userContext, UserProvider };
