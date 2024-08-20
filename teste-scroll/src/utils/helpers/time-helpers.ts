import { converterResponse, roundedOptions, timeOptions } from './models/time.model';

export class TimeConverters {
  /**
   * Converts Time from one unit into another.
   * @param value : number
   * @param initialUnit : timeOptions
   * @param formatedUnit : timeOptions
   * @param rounded : roundedOptions
   * @returns : number
   */
  static async converter(value: number, initialUnit: timeOptions, formatedUnit: timeOptions, rounded: roundedOptions = false) {
    let valueObj: converterResponse;
    let formatedValue: number;
    switch (initialUnit) {
      case 's':
        valueObj = await this.convertSeconds(value);
        break;
      case 'm':
        valueObj = await this.convertMinutes(value);
        break;
      case 'h':
        valueObj = await this.convertHours(value);
        break;
      case 'd':
        valueObj = await this.convertDays(value);
        break;
      case 'ms':
      default:
        valueObj = await this.convertMilliseconds(value);
        break;
    }

    switch (formatedUnit) {
      case 'ms':
        formatedValue = valueObj.milliseconds;
        break;
      case 'm':
        formatedValue = valueObj.minutes;
        break;
      case 'h':
        formatedValue = valueObj.hours;
        break;
      case 'd':
        formatedValue = valueObj.days;
        break;
      case 's':
      default:
        formatedValue = valueObj.seconds;
        break;
    }

    if (!rounded) return formatedValue;
    else if (typeof rounded === 'boolean') return Math.round(formatedValue);
    else return parseInt(formatedValue.toFixed(rounded));
  }

  /**
   * Converts milliseconds into other time units
   * @param amount: value in milliseconds
   * @returns converterResponse
   */
  private static convertMilliseconds(amount: number): converterResponse {
    const seconds = amount / 1000;
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;

    return {
      milliseconds: amount,
      seconds: seconds,
      minutes: minutes,
      hours: hours,
      days: days,
    };
  }

  /**
   * Converts seconds into other time units
   * @param amount: value in seconds
   * @returns converterResponse
   */
  private static convertSeconds(amount: number): converterResponse {
    const milliseconds = amount * 1000;
    const minutes = amount / 60;
    const hours = minutes / 60;
    const days = hours / 24;

    return {
      milliseconds: milliseconds,
      seconds: amount,
      minutes: minutes,
      hours: hours,
      days: days,
    };
  }

  /**
   * Converts minutes into other time units
   * @param amount: value in minutes
   * @returns converterResponse
   */
  private static convertMinutes(amount: number): converterResponse {
    const seconds = amount * 60;
    const milliseconds = seconds * 1000;
    const hours = amount / 60;
    const days = hours / 24;

    return {
      milliseconds: milliseconds,
      seconds: seconds,
      minutes: amount,
      hours: hours,
      days: days,
    };
  }

  /**
   * Converts hours into other time units
   * @param amount: value in hours
   * @returns converterResponse
   */
  private static convertHours(amount: number): converterResponse {
    const minutes = amount * 60;
    const seconds = minutes * 60;
    const milliseconds = seconds * 1000;
    const days = amount / 24;

    return {
      milliseconds: milliseconds,
      seconds: seconds,
      minutes: minutes,
      hours: amount,
      days: days,
    };
  }

  /**
   * Converts hours into other time units
   * @param amount: value in hours
   * @returns converterResponse
   */
  private static convertDays(amount: number): converterResponse {
    const hours = amount * 24;
    const minutes = hours * 60;
    const seconds = minutes * 60;
    const milliseconds = seconds * 1000;

    return {
      milliseconds: milliseconds,
      seconds: seconds,
      minutes: minutes,
      hours: hours,
      days: amount,
    };
  }

  /**
   * Returns an object with the number of hours, munutes and seconds of a unit value
   * @param timeAmount : number
   * @param timeUnit  : timeOptions
   * @returns
   */
  static formatTime = (timeAmount: number, timeUnit: timeOptions) => {
    let time = timeUnit !== 'ms' ? this.converter(timeAmount, timeUnit, 'ms') : timeAmount;

    const result = new Date(time as any).toISOString().substring(11, 19);

    return {
      hours: result.substring(0, 2),
      minutes: result.substring(3, 5),
      seconds: result.substring(6, 8),
    };
  };

  /**
   * Returns a string with the number of hours, minutes and seconds of a unit value
   * @param timeAmount : number
   * @param timeUnit : timeOptions
   * @returns
   */
  static getFormattedTime = async (timeAmount: number, timeUnit: timeOptions) => {
    const time = await this.formatTime(timeAmount, timeUnit);

    return `${parseInt(time.hours) ? `${time.hours}:` : ''}${time.minutes}:${time.seconds}`;
  };
}
