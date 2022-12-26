export class ClassName {
  private classes: string[];

  constructor(defaultClasses: string = "") {
    this.classes = [];
    this.classes.push(defaultClasses);
  }

  get fullClass() {
    return this.classes.join(" ");
  }

  /**
   * Adds classes to the default class based upon the
   * result of a condition.
   * @param isConditionTrue The condition to evaluate
   * @param resultsTrueClass The class(es) to add if the condition is true
   * @param resultsFalseClass The class(es) to add if the condition is false
   * @returns
   */
  addClass(
    isConditionTrue: boolean,
    resultsTrueClass: string = "",
    resultsFalseClass: string = ""
  ) {
    isConditionTrue
      ? this.classes.push(resultsTrueClass)
      : this.classes.push(resultsFalseClass);

    return this;
  }
}
