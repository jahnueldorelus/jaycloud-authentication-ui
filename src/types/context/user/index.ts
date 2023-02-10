import { TokenData } from "@app-types/services/user";

export type UserState = {
  user: TokenData | null;
  userDispatch: React.Dispatch<UserAction>;
};

type StoreAction<T extends string, K> = { type: T; payload: K };
export type UserAction = StoreAction<"setUser", TokenData | null>;

export type UserProviderProps = {
  children: JSX.Element;
};
