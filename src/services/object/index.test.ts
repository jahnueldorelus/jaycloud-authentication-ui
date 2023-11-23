import { objectService } from ".";

describe("Service - Object", () => {
  const dummyObjectData = { data: "hi" };
  const dummyObject = { data: dummyObjectData };

  it("Should find an object not empty", () => {
    expect(objectService.isObjectEmpty(dummyObject)).toBe(false);
  });

  it("Should find an object empty", () => {
    expect(objectService.isObjectEmpty({})).toBe(true);
  });

  it("Should make a shallow copy of an object", () => {
    const shallowCopy = objectService.shallowClone(dummyObject);

    expect(shallowCopy).not.toBe(dummyObject);
    expect(shallowCopy.data).toBe(dummyObjectData);
  });
});
