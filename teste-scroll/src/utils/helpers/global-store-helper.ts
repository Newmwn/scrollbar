/**
 * Helper class for managing global store data with encryption.
 */
export class GlobalStoreHelper {
  // The secret key used for encryption.
  private static secret = '';
  // The keys that should not be encrypted.
  private static nonEncryptedKeys = [];

  /**
   * Initializes the GlobalStoreHelper.
   * @param salt - The secret key used for encryption.
   * @param nonEncryptedKeys - The keys that should not be encrypted.
   */
  static init(salt: string, nonEncryptedKeys: string[] = []) {
    GlobalStoreHelper.secret = salt;
    GlobalStoreHelper.nonEncryptedKeys = nonEncryptedKeys;
    window['Niup'] = {};
  }

  /**
   * Adds non-encrypted keys to the list of keys that should not be encrypted.
   * @param keys - The keys that should not be encrypted.
   */
  static addNonEncryptedKeys(keys: string[]) {
    if (!window['Niup']) window['Niup'] = {};
    let nonRepeated = keys.filter(key => !GlobalStoreHelper.nonEncryptedKeys.includes(key));

    //  This method decrypts the data if it exists in the window object and if it is already encrypted.
    for (let key of nonRepeated) {
      if (window['Niup'][key] != null && GlobalStoreHelper.secret != '') {
        window['Niup'][key] = GlobalStoreHelper.decrypt(window['Niup'][key]);
      }
    }

    GlobalStoreHelper.nonEncryptedKeys = [...GlobalStoreHelper.nonEncryptedKeys, ...nonRepeated];
  }

  /**
   * Retrieves decrypted data from the window object encrypted data.
   * @param key - The key associated with the data.
   * @returns The decrypted data or null if the data is not found.
   */
  static GetSharedData<ReturnedDataType>(key: string): ReturnedDataType {
    return GlobalStoreHelper.nonEncryptedKeys.includes(key)
      ? window['Niup'][key] != null
        ? typeof window['Niup'][key] === 'object'
          ? window['Niup'][key]
          : JSON.parse(window['Niup'][key])
        : {}
      : GlobalStoreHelper.decrypt<ReturnedDataType>(window['Niup'][key]);
  }

  /**
   * Writes encrypted data to the window object.
   * @param key - The key associated with the data.
   * @param data - The data to be encrypted and written.
   */
  static WriteSharedData(key: string, data) {
    window['Niup'][key] = GlobalStoreHelper.nonEncryptedKeys.includes(key) ? JSON.stringify(data) : GlobalStoreHelper.encrypt(JSON.stringify(data));
  }

  /**
   * Deletes data from the window object.
   * @param key - The key associated with the data.
   */
  static DeleteSharedData(key: string) {
    delete window['Niup'][key];
  }

  /**
   * Encrypts text using a secret key.
   * @param text - The text to be encrypted.
   * @returns The encrypted text.
   */
  private static encrypt(text: string) {
    // Converts text to an array of character codes.
    const textToChars = text => text.split('').map(c => c.charCodeAt(0));
    // Converts a number to a hexadecimal string.
    const byteHex = n => ('0' + Number(n).toString(16)).substr(-2);
    // Applies the secret key to a character code.
    const applySaltToChar = code => textToChars(GlobalStoreHelper.secret).reduce((a, b) => a ^ b, code);

    // Encrypts the text by applying the secret key to each character code.
    return text.split('').map(textToChars).map(applySaltToChar).map(byteHex).join('');
  }

  /**
   * Decrypts text using a secret key.
   * @param encoded - The encrypted text.
   * @returns The decrypted text.
   */
  private static decrypt<ReturnedDataType>(encoded: string): ReturnedDataType {
    // Converts text to an array of character codes.
    const textToChars = text => text.split('').map(c => c.charCodeAt(0));
    // Applies the secret key to a character code.
    const applySaltToChar = code => textToChars(GlobalStoreHelper.secret).reduce((a, b) => a ^ b, code);

    // Decrypts the text by applying the secret key to each hexadecimal code.
    let encryptedString = encoded
      .match(/.{1,2}/g)
      .map(hex => parseInt(hex, 16))
      .map(applySaltToChar)
      .map(charCode => String.fromCharCode(charCode))
      .join('');

    return encryptedString !== null ? JSON.parse(encryptedString) : null;
  }
}
