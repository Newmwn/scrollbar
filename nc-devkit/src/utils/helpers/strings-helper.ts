export class StringsHelper {
  /**
   *  Method responsible for triming string values
   * @param value
   * @returns if it's a string and not empty ('') returns a trimed string, if it's an empty string returns null, else returns the unchanged value
   */
  public static trimmer(value: any) {
    return typeof value === 'string' ? value.trim() || null : value ?? null;
  }

  private static helperGetTwoLettersFromPhrase(splitPhraseArray: string[], regexAllExceptionLetter: any, defaultValueReturn: string = ''): string {
    return splitPhraseArray.length === 0
      ? ''
      : splitPhraseArray.length === 1
      ? regexAllExceptionLetter.test(splitPhraseArray[0][0])
        ? splitPhraseArray[0][0]
        : ''
      : regexAllExceptionLetter.test(splitPhraseArray[0][0]) && regexAllExceptionLetter.test(splitPhraseArray[0][1])
      ? splitPhraseArray[0][0] + splitPhraseArray[0][1]
      : regexAllExceptionLetter.test(splitPhraseArray[0][0])
      ? splitPhraseArray[0][0]
      : regexAllExceptionLetter.test(splitPhraseArray[0][1])
      ? splitPhraseArray[0][1]
      : defaultValueReturn;
  }

  public static getTwoLettersFromPhrase(phrase: string, defaultValueReturn: string = ''): string {
    if (phrase == null) return defaultValueReturn;

    const regexAllExceptionLetter = /^[a-z0-9áàâãéèêíïóôõöúçñ ]+$/i;
    const splitTrim = StringsHelper.trimmer(phrase);
    let splitPhraseArray = splitTrim.split(' ');

    //trimer all words
    for (let i = 0; i < splitPhraseArray.length; i++) splitPhraseArray[i] = StringsHelper.trimmer(splitPhraseArray[i]);

    let value;
    //Rules if only exist 1 word on phrase
    if (splitPhraseArray.length === 1) {
      value = this.helperGetTwoLettersFromPhrase(splitPhraseArray, regexAllExceptionLetter, defaultValueReturn);
      //Rules if exist tow or more words on phrase
    } else {
      value =
        regexAllExceptionLetter.test(splitPhraseArray[0][0]) && regexAllExceptionLetter.test(splitPhraseArray[1][0])
          ? splitPhraseArray[0][0] + splitPhraseArray[1][0]
          : regexAllExceptionLetter.test(splitPhraseArray[0][0])
          ? splitPhraseArray[0][0]
          : regexAllExceptionLetter.test(splitPhraseArray[1][0])
          ? this.helperGetTwoLettersFromPhrase([splitPhraseArray[1]], regexAllExceptionLetter, defaultValueReturn)
          : this.helperGetTwoLettersFromPhrase([splitPhraseArray[0]], regexAllExceptionLetter, defaultValueReturn);
    }
    return value.toUpperCase();
  }
}
