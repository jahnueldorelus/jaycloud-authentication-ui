import { CreateUserResult } from "@app-types/services/user";
import { AuthAction, UserData } from "@app-types/store/auth";
import { apiService } from "@services/api";
import { isAxiosError } from "axios";

export class UserService {
  /**
   * Attempts to create a new user.
   * @param requestBody The data to send with the request
   * @param authDispatch The authorization context for saving the user's info
   */
  async createUser(
    requestBody: object,
    authDispatch: React.Dispatch<AuthAction>
  ): Promise<CreateUserResult> {
    const result = await apiService.request(
      apiService.routes.post.users.create,
      {
        data: requestBody,
        method: "POST",
      }
    );

    // If a response was returned
    if (result && !isAxiosError(result)) {
      authDispatch({ type: "userAdded", payload: result.data });

      return {
        errorMessage: "",
        errorOccurred: false,
      };
    }
    // If an error occurred
    else if (result && isAxiosError(result)) {
      const errorMessage: string = result.response ? result.response.data : "";

      return {
        errorMessage,
        errorOccurred: true,
      };
    } else {
      return {
        errorMessage: "A random error test",
        errorOccurred: true,
      };
    }
  }

  /**
   * Retrieves the full name of a user.
   * @param user The user to retrieve the full name from
   */
  getFullName(user: UserData | null) {
    if (user) {
      const firstName =
        user.firstName[0] &&
        user.firstName[0].toUpperCase() + user.firstName.slice(1);

      const lastName =
        user.lastName[0] &&
        user.lastName[0].toUpperCase() + user.lastName.slice(1);

      return `${firstName} ${lastName}`;
    } else {
      return "";
    }
  }
}

export const userService = new UserService();
