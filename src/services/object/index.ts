class ObjectService {
  /**
   * Determines if an object is empty.
   */
  isObjectEmpty(obj: object) {
    return Object.keys(obj).length === 0;
  }

  /**
   * Creates a shallow copy of an object.
   * @param obj The object to copy
   */
  shallowClone<T extends object>(obj: T) {
    return { ...obj };
  }
}

export const objectService = new ObjectService();
