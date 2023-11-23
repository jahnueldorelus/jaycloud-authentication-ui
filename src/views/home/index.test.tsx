import { Home } from "@views/home";
import { render, waitFor, screen } from "@testing-library/react";
import { SpyInstance, vi } from "vitest";
import { cloudService } from "@services/cloud-service";
import { Service } from "@app-types/entities";
import { uiRoutes } from "@components/navbar/routes";
import { addRouterProvider } from "@tests/helper";

describe("Home", () => {
  const homeJSX = addRouterProvider(<Home />);

  const mockHelper = vi.hoisted(() => ({
    services: [1, 2, 3].map((id) => ({
      _id: id.toString(),
      available: true,
      description: "",
      name: "",
      uiUrl: "",
    })),
  }));

  const mocks = vi.hoisted(() => ({
    getServices: vi.fn() as SpyInstance<[], Promise<Service[] | null>>,
  }));

  vi.mock("react-router-dom", async () => {
    const reactRouterDom = (await vi.importActual(
      "react-router-dom"
    )) as typeof import("react-router-dom");

    return {
      ...reactRouterDom,
      useLocation: vi.fn(),
    };
  });

  beforeEach(() => {
    mocks.getServices = vi
      .spyOn(cloudService, "getServices")
      .mockImplementation(async () => mockHelper.services);
  });

  afterEach(() => {
    mocks.getServices.mockRestore();
  });

  it("Should show list of services after successful retrieval", async () => {
    render(homeJSX);

    await waitFor(async () => {
      const serviceCards = screen.getAllByTestId("service-card-title");

      expect(serviceCards.length).toBe(mockHelper.services.length);
    });
  });

  it("Should show list of service placeholders after failed retrieval", async () => {
    mocks.getServices.mockImplementationOnce(async () => null);
    render(homeJSX);

    await waitFor(async () => {
      const serviceCards = screen.getAllByTestId("placeholder-card-title");

      expect(serviceCards.length).toBe(mockHelper.services.length);
    });
  });

  it("Should have a link in the document to sign in", async () => {
    render(homeJSX);

    await waitFor(() => {
      const linkElements = screen.getAllByRole("link") as HTMLAnchorElement[];

      const foundSignInLink = linkElements.reduce(
        (prevValue: boolean, currElement: HTMLAnchorElement) => {
          return prevValue || currElement.pathname === uiRoutes.login;
        },
        false
      );

      expect(foundSignInLink).toBe(true);
    });
  });

  it("Should have a link in the document to create an account", async () => {
    render(homeJSX);

    await waitFor(() => {
      const linkElements = screen.getAllByRole("link") as HTMLAnchorElement[];

      const foundRegisterLink = linkElements.reduce(
        (prevValue: boolean, currElement: HTMLAnchorElement) => {
          return prevValue || currElement.pathname === uiRoutes.register;
        },
        false
      );

      expect(foundRegisterLink).toBe(true);
    });
  });
});
