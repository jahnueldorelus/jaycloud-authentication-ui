class ObjectService {
  /**
   * Determines if an object is empty.
   */
  isObjectEmpty = (obj: object) => {
    return Object.keys(obj).length === 0;
  };
}

export const objectService = new ObjectService();
