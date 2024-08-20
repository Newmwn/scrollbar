export class DatesHelper {
  /**
   * Sets date in utc format to api save
   * Use it in the prepare object function for api save
   * @param localDate current local date
   */
  static setApiDate(localDate: Date) {
    return localDate instanceof Date ? localDate?.toISOString() : null;
  }

  /**
   * Gets date in utc format to local date
   * Use it in the formGroup/DataObject set function
   * @param utcDate date in utc formaat
   */
  static getApiDate(utcDate: string) {
    return utcDate != null
      ? new Date(
          utcDate.length > 0 && utcDate.slice(-1) !== 'Z'
            ? utcDate + 'Z'
            : utcDate
        )
      : null;
  }

  /**
   * Can be used, for instance, in date ValueFormatter grid column
   * @param datePipe Angular common datepipe
   * @param date Api date string format in ISOString
   * @param format Date formate to be shown
   * Format example if should return hours: dd/MM/yyyy, HH:mm
   */
  static formatToRegularDateString(
    datePipe,
    date,
    format: string = 'dd/MM/yyyy'
  ) {
    let dateStr = '';
    let currentTimezoneOffset = -(new Date().getTimezoneOffset() / 60);
    let timezone = `UTC${
      currentTimezoneOffset < 0
        ? currentTimezoneOffset
        : '+' + currentTimezoneOffset
    }`;

    if (
      typeof date === 'string' &&
      date?.length > 0 &&
      date.slice(-1) !== 'Z'
    ) {
      date = date + 'Z';
    }

    if (date) {
      dateStr = datePipe.transform(date, format, timezone);
    }
    return dateStr;
  }

  /**
   * Returns UTC Date
   * @param date date to convet
   */
  static setUTCDate(date) {
    let dateMili = Number(new Date(date).getTime());
    let timezone = Number(new Date().getTimezoneOffset()) * 60 * 1000;

    dateMili -= timezone;
    return new Date(dateMili);
  }

  /**
   * It will process the date to the local date of the user
   * @param value Date to be passed into the Local date
   */
  static getLocaleDate(value: Date) {
    if (value !== undefined) {
      var tempDate = new Date(value);

      var newDate = new Date(
        tempDate.getTime() + tempDate.getTimezoneOffset() * 60 * 1000
      );
      var offset = tempDate.getTimezoneOffset() / 60;
      var hours = tempDate.getHours();
      newDate.setHours(hours - offset);
      return newDate;
    }
  }

  /**
   * Receives a date and will add to the max time of that date
   * @param date Date to get the max time
   */
  static getMaxDate(date: Date = null): Date {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      23,
      59,
      59
    );
  }
}
