export class ArrayHelper {
  constructor() {}

  static filterArrayBySelectedProp(mainArray: Array<any>, value, prop = 'id') {
    return value ? mainArray.filter(elem => elem[prop] === value) : [];
  }

  static removeElementsfromArray(mainArray: Array<any> = [], secArray: Array<any> = [], prop = 'id') {
    return mainArray.filter(elem => secArray.every(secElem => elem[prop] !== secElem[prop]));
  }

  static moveIndexArray(arr: Array<any>, currentIndex: number, newIndex: number) {
    if (newIndex >= arr.length) {
      let k = newIndex - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(newIndex, 0, arr.splice(currentIndex, 1)[0]);
    return arr;
  }

  static addElementsToArray(mainArray: Array<any> = [], secElements: Array<any> | any = []) {
    let newElems = Array.isArray(secElements) ? secElements : [secElements];
    return (mainArray = [...mainArray, ...newElems]);
  }

  static getArrayOfPropertyValue(mainArray, prop = 'id') {
    let value = [];
    mainArray.forEach(element => (value = [...value, element[prop]]));
    return value;
  }

  /**
   * Function to check if an array has repeated values by a specific property
   * @param array : Array<any>
   * @param propertyName : string
   * @returns boolean
   */
  static isArrayPropertyRepeated(array: Array<any>, propertyName: string) {
    const uniqueValues = new Set(array.map(v => v[propertyName]));
    return uniqueValues.size < array.length;
  }
}
