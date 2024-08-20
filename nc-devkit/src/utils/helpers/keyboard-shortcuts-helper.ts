import Mousetrap from 'mousetrap-ts';
import { DefaultKeyboardShortcuts } from '../misc/enums/defaultShortcuts.enum';

export class KeyboardShortcutsHelper {
  /** Shortcuts Listener */
  static keyboardListener: Mousetrap;

  /**
   * Function to listen the keyboard inputs and if some match with someone in the keyboard shortcuts list to IOS or Windows OS, bind him and returns his command
   * @param targetElement
   * @param callback
   * @param eventType
   */
  static bindKeyboardShortcuts(targetElement: HTMLElement, callback: Function, eventType: string = 'keydown') {
    this.keyboardListener = new Mousetrap(targetElement);
    Object.keys(DefaultKeyboardShortcuts).forEach(key => {
      const shortcut = key as keyof typeof DefaultKeyboardShortcuts;
      this.keyboardListener.bind(
        [DefaultKeyboardShortcuts[shortcut].mac, DefaultKeyboardShortcuts[shortcut].win],
        () => handler(DefaultKeyboardShortcuts[shortcut].value),
        eventType,
      );
    });

    /**
     * Function to handle the call back function
     * @param commnad
     * @returns
     */
    function handler(commnad: string): boolean {
      if (commnad) {
        callback(commnad);
        return true;
      } else {
        callback(null);
        return false;
      }
    }
  }

  /**
   * Fucntion to unbind a keyboard shortcut
   * @param keyboardshortcut
   * @param eventType
   */
  static unbindKeyShortcut(keyboardshortcut: string, eventType: string = 'keydown') {
    this.keyboardListener.unbind(keyboardshortcut, eventType);
  }
  /**
   * Function to destroy the listener
   * @returns
   */
  static destroyKeyboardListener() {
    if (this.keyboardListener == null) return;
    this.keyboardListener.destroy();
  }
}
