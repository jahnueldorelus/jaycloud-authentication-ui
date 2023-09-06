import { render } from "@testing-library/react";
import { addUserProvider } from "@tests/helper";
import { UserInfo } from "@views/profile/components/user-info";

describe("Profile - User Info", () => {
  it("Should show the user's info", () => {
    const userInfoJSX = addUserProvider(<UserInfo />, true);
    const { getAllByTestId } = render(userInfoJSX);

    const labelElements = getAllByTestId("user-info-label");
    expect(labelElements.length).toBe(3);
  });

  it("Should show a placeholder for the user's info", () => {
    const userInfoJSX = addUserProvider(<UserInfo />);
    const { getByTestId } = render(userInfoJSX);

    const placeholderElement = getByTestId("user-info-placeholder");
    expect(placeholderElement).toBeInTheDocument();
  });
});
