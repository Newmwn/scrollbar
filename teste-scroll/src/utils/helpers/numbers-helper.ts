export class NumbersHelper {
  /**
   * Formats number according to defined decimalPlaces
   * @param value value to format
   * @param numberOfDecimalPlaces number of decimal places to format to
   * @param ignoreTrailingZeros if trailing zeros should be ignored or not
   */
  static decimalsFormatter = (
    value,
    numberOfDecimalPlaces: number = 0,
    ignoreTrailingZeros: boolean = false
  ) => {
    return ignoreTrailingZeros
      ? Number(value.toFixed(numberOfDecimalPlaces))
      : value.toFixed(numberOfDecimalPlaces);
  };

  /**
   * Format numbers and give them space for every 3 numbers (3000 => 3 000),
   * currency symbol can be added and use decimal cases
   * @param valueUnformated Value to format
   * @param currency Currency to use, if null doesn't put nothing
   * @param decimal decimal cases
   * @param ignoreZeroValues Ignore the zero values from the number
   * @param removeTrailingZeros Remove zeros after point
   * @returns string or number
   */
  static formatNumbers = (
    valueUnformated: any,
    currency: string = null,
    decimal: number = 2,
    ignoreZeroValues: boolean = false,
    removeTrailingZeros: boolean = false
  ): number | string => {
    const money = valueUnformated;
    const numberOfDecimalPlaces: number = decimal;
    let val =
      money != null
        ? typeof money === 'number'
          ? money.toFixed(numberOfDecimalPlaces).toString()
          : money.toFixed(numberOfDecimalPlaces)
        : null;

    if (val === null || (ignoreZeroValues && Number(val) === 0)) return '';
    let splitedValue = removeTrailingZeros
      ? Number(val).toString().split('.')
      : val.split('.');

    if (splitedValue.length > 0) {
      let nonDecimalPart =
        splitedValue[0]?.length <= (splitedValue[0][0] === '-' ? 4 : 3)
          ? splitedValue[0]
          : splitedValue[0].replaceAll(/\B(?=(?:...)+$)/g, ' ');
      let decimalPart = splitedValue.length > 1 ? splitedValue[1] : null;
      val = `${nonDecimalPart}${decimalPart ? `.${decimalPart}` : ''}`;

      return currency ? `${val} ${currency}` : val;
    }
  };
}
