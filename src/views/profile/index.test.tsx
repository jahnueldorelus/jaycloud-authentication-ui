import { FormModel } from "@app-types/form-model";
import { formModelService } from "@services/form-model";
import { SpyInstance } from "vitest";
import { Profile } from "@views/profile";
import { render, waitFor, screen } from "@testing-library/react";
import { testDataIds } from "@tests/helper";

describe("Profile", () => {
  const profileJSX = <Profile />;

  const mocks = vi.hoisted(() => ({
    getProfileUpdateForm: vi.fn() as SpyInstance<[], Promise<FormModel | null>>,
    updateProfileFormData: {
      title: "FORM-TITLE",
      inputs: [
        {
          label: "email",
          multiline: false,
          name: "email",
          requestBodyProperty: "email",
          type: "email",
          validation: {
            allowNull: true,
            max: 10,
            min: 0,
            regex: [],
            regexErrorLabel: "",
            required: false,
          },
        },
      ],
    } as FormModel,
    useLocation: vi.fn(() => ({})),
    navLink: vi.fn(),
  }));

  beforeEach(() => {
    // Prevents API service from being called when retrieving the update profile form
    mocks.getProfileUpdateForm = vi
      .spyOn(formModelService, "getProfileUpdateForm")
      .mockImplementation(async () => mocks.updateProfileFormData);

    // Mocks React Router Dom
    vi.mock("react-router-dom", () => ({
      useLocation: mocks.useLocation,
      NavLink: mocks.navLink,
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
    mocks.getProfileUpdateForm.mockRestore();
  });

  it("Should successfully retrieve the form to update the user's profile", async () => {
    render(profileJSX);

    await waitFor(() => {
      expect(mocks.getProfileUpdateForm).toHaveBeenCalledTimes(1);
    });
  });

  it("Should fail retrieve the form to update the user's profile", async () => {
    mocks.getProfileUpdateForm.mockReturnValueOnce(Promise.resolve(null));
    render(profileJSX);

    await waitFor(async () => {
      const uiErrorElement = await screen.findByTestId(testDataIds.appUiError);
      expect(uiErrorElement).toBeInTheDocument();
    });
  });

  it("Should show loader while retrieving the form to update the user's profile upon first load", async () => {
    render(profileJSX);

    await waitFor(async () => {
      const loaderElement = screen.getByTestId(testDataIds.appLoader);
      expect(loaderElement).toBeInTheDocument();
    });
  });
});
