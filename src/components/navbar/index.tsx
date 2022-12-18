import { authStore } from "@store/index";
import { useContext } from "react";

export const Navbar = () => {
  const authState = useContext(authStore);

  const onButtonClick = () => {
    authState.dispatch({
      type: "userAdded",
      payload: authState.user ? null : "JDFIRE",
    });
  };

  return (
    <div>
      <h3>User: {authState.user}</h3>
      <h3>JayCloud</h3>
      <button onClick={onButtonClick}>Click on me to add user!</button>
    </div>
  );
};
