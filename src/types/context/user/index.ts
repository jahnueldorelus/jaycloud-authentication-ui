import { TokenData } from "@app-types/services/user";

export type UserState = {
  user: TokenData | null;
  userDispatch: React.Dispatch<UserActions>;
};

type StoreAction<T extends string, K> = { type: T; payload: K };
type NewUserInfoAction = StoreAction<"setUser", TokenData | null>;
export type UserActions = NewUserInfoAction;

export type UserProviderProps = {
  children: JSX.Element;
};
