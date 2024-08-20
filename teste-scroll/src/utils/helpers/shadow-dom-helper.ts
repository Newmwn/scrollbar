/** Class with methods to help with shadow dom */
export class ShadowDomHelper {
  /**
   * Function that will return the first element that matches the selector
   * @param {Element} rootElement Root element were the search will be made
   * @param {string} selector Selector name to be searched
   * @description  This function will return the first element that matches the selector, like "querySelector", but through a light or shadow dom
   * @returns HTMLElement or null
   */
  static searchElement(rootElement: Element, selector: string) {
    // Return null if rootElement is null
    if (!rootElement) return null;

    /** Element that matches the selector */
    const foundedElement = rootElement.shadowRoot ? rootElement.shadowRoot.querySelector(selector) : rootElement.querySelector(selector);
    // If element its founded, return him
    if (foundedElement) return foundedElement;

    /** List of all sub elements, children of the element passed as "rootElement" */
    const allSubElements = rootElement.querySelectorAll('*');
    /** List of sub elements with shadow root */
    const shadowElements = Array.from(allSubElements).filter((subElement: Element) => subElement.shadowRoot);

    // Call "searchElement" on each shadow element
    for (let shadowElement of shadowElements) {
      /** Element resulted from the search of "searchElement" on each shadow element */
      const result = this.searchElement(shadowElement, selector);
      // If the element is founded, return him
      if (result) return result;
    }

    return null;
  }

  /**
   * Function that will return the first descendant element that matches with the path done by the selectors
   * @param rootElement Root element were the search will start
   * @param selectorsPath List of selectors separated by spaces, that will make the path
   * @description This function will return the first descendant element that matches with the path done by the selectors, same as "querySelector" with multiple selectors, separated by spaces, trough a light or shadow dom
   * @returns HTMLElement or null
   */
  static searchDescendantElement(rootElement: Element, selectorsPath: string) {
    /** List of selectors strings,separated by spaces */
    const selectorStrings = selectorsPath.split(' ');
    // Return null if the selectorsPath doesn't have at least 2 strings or if the rootElement is null
    if (selectorStrings.length < 2 || !rootElement) return;
    /** Element resulted from the search of "searchElement" on rootElement for the first selector */
    let resultElement = ShadowDomHelper.searchElement(rootElement, selectorStrings[0]);
    // If the element is not founded, return null
    if (!resultElement) return;

    // Call "searchElement" on each remain selector
    for (let i = 1; i < selectorStrings.length; i++) {
      /** Next element on the search, folowing the selectors path */
      let nextElement = ShadowDomHelper.searchElement(resultElement, selectorStrings[i]);
      // If the next element is not founded, return null
      if (!nextElement) return;
      // If the next element is founded, update the resultElement
      resultElement = nextElement;
    }
    return resultElement;
  }

  /**
   * Method that will return the closest (ancestor) element that matches the selector, through a shadow dom
   * @param {any} sourceElement Element that will be used as pointing start
   * @param {string} selector Selector name to be searched
   * @returns Closest element, if existes
   */
  static closestPassShadow(sourceElement: any, selector: string) {
    // Return null if sourceElement is null
    if (!sourceElement) {
      return null;
    }

    // If sourceElement is a shadow dom, call "closestPassShadow" on his host
    if (sourceElement instanceof ShadowRoot) {
      return this.closestPassShadow(sourceElement.host, selector);
    }

    // If sourceElement is not a shadow dom, check if it matches the selector
    if (sourceElement instanceof HTMLElement) {
      // If the sourceElement matches with the selector, return the element
      if (sourceElement.matches(selector)) {
        return sourceElement;
        // If the sourceElement does not match with the selector, call "closestPassShadow" on his parent
      } else {
        return this.closestPassShadow(sourceElement.parentNode, selector);
      }
    }

    return this.closestPassShadow(sourceElement.parentNode, selector);
  }
}
