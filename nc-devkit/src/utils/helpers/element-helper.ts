export class ElementHelper {
  /**
   * Method that will return the CSS property value of an element
   * @param containerRef  Element | any
   * @param className string
   * @param propName string
   * @returns any
   */
  static getElemPropValue(
    containerRef: Element | any,
    className: string,
    propName: string
  ): number | string | null {
    if (!containerRef) return null;
    const value =
      window
        .getComputedStyle(containerRef.querySelector(className))
        .getPropertyValue(propName) ?? null;

    return value.endsWith("px") ? parseInt(value) : value;
  }

  /**
   * Method that will return the desired max-height according to the number of lines.
   * @param containerRef Element | any
   * @param className string
   * @param numberOfLines string
   * @returns number
   */
  static async getElemTrimMaxHeight(
    containerRef: Element | any,
    className: string,
    numberOfLines: number
  ): Promise<number | null> {
    if (!containerRef) return null;
    const value = await this.getElemPropValue(
      containerRef,
      className,
      "line-height"
    );

    return (value as number) * numberOfLines;
  }
}
