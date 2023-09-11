import { ClassName } from "@services/class-name";

describe("Service - Class Name", () => {
  const defaultClasses = "p-3 d-flex justify-content-center";

  it("Should create a className with default classes", () => {
    const className = new ClassName(defaultClasses);

    expect(className.fullClass).toBe(defaultClasses);
  });

  it("Should create a className with default classes, and added classes", () => {
    const addedClasses: string[] = ["mx-3", "align-items-center"];
    const className = new ClassName(defaultClasses);
    addedClasses.forEach((newClass) => className.addClass(true, newClass));

    expect(className.fullClass).toBe(
      defaultClasses.concat(" ", addedClasses.join(" "))
    );
  });
});
