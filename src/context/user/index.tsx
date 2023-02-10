import {
  UserState,
  UserProviderProps,
  UserAction,
} from "@app-types/context/user";
import { objectService } from "@services/object";
import { createContext, useReducer } from "react";

const initialState: UserState = {
  user: null,
  userDispatch: () => {}, // Temporary function that will be replaced
};

const context = createContext(initialState);
const { Provider } = context;

const UserProvider = (props: UserProviderProps) => {
  const reducer: React.Reducer<UserState, UserAction> = (
    state: UserState,
    action: UserAction
  ) => {
    switch (action.type) {
      case "setUser":
        const newState = objectService.shallowClone(state);
        newState.user = action.payload;
        return newState;

      default:
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
