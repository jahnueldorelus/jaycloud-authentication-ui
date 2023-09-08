import { Service } from "@app-types/entities";
import { cloudService } from "@services/cloud-service";
import { SpyInstance } from "vitest";
import { Services } from "@views/services";
import { render, screen, waitFor } from "@testing-library/react";
import { testDataIds } from "@tests/helper";

describe("Services", () => {
  const servicesJSX = <Services />;

  const mocks = vi.hoisted(() => ({
    getServices: vi.fn() as SpyInstance<[], Promise<Service[] | null>>,
    useLocation: vi.fn(),
    navLink: vi.fn(),
  }));

  beforeEach(() => {
    // Prevents call to API service
    mocks.getServices = vi
      .spyOn(cloudService, "getServices")
      .mockImplementation(async () => [
        {
          _id: "id",
          available: true,
          description: "description",
          name: "service",
          uiUrl: "url",
        },
      ]);

    // Mocks React Router Dom
    vi.mock("react-router-dom", () => ({
      useLocation: mocks.useLocation,
      NavLink: mocks.navLink,
    }));
  });

  afterEach(() => {
    mocks.getServices.mockRestore();
  });

  it("Should sucessfully retrieve the list of services and display it", async () => {
    render(servicesJSX);

    await waitFor(async () => {
      const serviceCardElement = await screen.findByTestId(
        "service-card-title"
      );

      expect(serviceCardElement).toBeInTheDocument();
    });
  });

  it("Should fail to retrieve the list of services", async () => {
    mocks.getServices.mockReturnValueOnce(Promise.resolve(null));
    render(servicesJSX);

    await waitFor(async () => {
      const uiErrorElement = await screen.findByTestId(testDataIds.appUiError);

      expect(uiErrorElement).toBeInTheDocument();
    });
  });

  it("Should show a placeholder while retrieving the list of services", async () => {
    render(servicesJSX);
    const serviceCardPlaceholderElement = screen.getAllByTestId(
      "service-card-placeholder"
    );

    await waitFor(() => {
      expect(serviceCardPlaceholderElement.length).toBe(3);
    });
  });
});
