import { render } from "@testing-library/react";
import { testDataIds } from "@tests/helper";
import { ErrorCard } from "@views/error/components/error-card/index";

// Mocks React Router Dom
vi.mock("react-router-dom");

describe("Error Card", () => {
  it("Should render error card with custom title", () => {
    const testTitle = "My-Custom-Title";
    const { getByTestId } = render(<ErrorCard title={testTitle} />);
    const cardTitle = getByTestId(testDataIds.appError.title);

    expect(cardTitle.textContent).toBe(testTitle);
  });

  it("Should render error card with custom message", () => {
    const testMessage = "My-Custom-Message";
    const { getByTestId } = render(<ErrorCard message={testMessage} />);
    const cardMessage = getByTestId(testDataIds.appError.message);

    expect(cardMessage.textContent).toBe(testMessage);
  });
});
