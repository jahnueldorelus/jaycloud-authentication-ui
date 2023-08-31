import { render } from "@testing-library/react";
import { ErrorCard } from "@views/error/components/error-card/index";

// Mocks React Router Dom
vi.mock("react-router-dom");

describe("Error Card", () => {
  it("Should render error card with custom title", () => {
    const testTitle = "My-Custom-Title";
    const { getByTestId } = render(<ErrorCard title={testTitle} />);
    const cardTitle = getByTestId("card-title");

    expect(cardTitle.textContent).toBe(testTitle);
  });

  it("Should render error card with custom message", () => {
    const testMessage = "My-Custom-Message";
    const { getByTestId } = render(<ErrorCard message={testMessage} />);
    const cardMessage = getByTestId("card-message");

    expect(cardMessage.textContent).toBe(testMessage);
  });
});
