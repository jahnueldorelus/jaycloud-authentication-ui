import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

/**
 * This declaration allows jest-dom matchers types to be available
 * in tests.
 */
declare global {
  namespace jest {
    interface Matchers<R = void>
      extends matchers.TestingLibraryMatchers<
        typeof expect.stringContaining,
        R
      > {}
  }
}

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});
