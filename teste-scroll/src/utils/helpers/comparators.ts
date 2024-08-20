export class Comparators {
  constructor() { }

  static objectComparator(
    value,
    copy,
    exceptions: Array<any> = [],
    compareFalse: boolean = false
  ) {
    let currentValue = JSON.stringify(value, (key, val) => {
      if ((val || compareFalse) && val != null && !exceptions.includes(key))
        return val;
    });
    let copyValue = JSON.stringify(copy, (key, val) => {
      if ((val || compareFalse) && val != null && !exceptions.includes(key))
        return val;
    });
    return !(currentValue === copyValue);
  }


  /**
   * Function that compares two elements
   * @param obj1
   * @param obj2
   * @param fullCheck flag that if true checks if obj1 is totally equal to obj2. If false it just checks if obj2 contains obj1 with the same values
   * @returns comparation result
   */
  static deepComparator(obj1, obj2, fullCheck = false, compareOrder = false): boolean {

    if (obj1 == null && obj2 == null) return true;
    if (obj1 == null || obj2 == null) return false;
    if (typeof obj1 !== typeof obj2) return false;
    if (Array.isArray(obj1)) {
      if (fullCheck && obj1.length !== obj2.length) return false;
      return obj1.every((item, index) => compareOrder ?
        this.deepComparator(item, obj2[index], fullCheck, compareOrder) :
        obj2.some(elem => this.deepComparator(item, elem, fullCheck, compareOrder))
      )
    }
    if (typeof obj1 !== 'object') {
      return obj1 === obj2;
    } else {
      if (fullCheck && Object.keys(obj1).length !== Object.keys(obj2).length) return false;
      return Object.keys(obj1).every(key => {
        return this.deepComparator(obj1[key], obj2[key], fullCheck, compareOrder);
      });
    }

  }
}
