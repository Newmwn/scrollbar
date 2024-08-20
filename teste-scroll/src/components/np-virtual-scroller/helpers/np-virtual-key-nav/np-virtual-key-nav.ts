import { Direction } from '../../../../utils/misc/enums/direction.enum';
import { KeyNavConfig } from './models/np-key-nav.model';

export class NpVirtualKeyNav {
  //#region LOCAL VARIABLES

  /** element to focus while navigating */
  public elemToFocus: any = null;

  /** The list of list elements */
  private listItems: Array<HTMLElement> = [];

  /** Virtuall scrollerRef configs, they dependend on the scrollerRef direction */
  private scrolConfig: {
    scrollType: 'scrollTop' | 'scrollLeft';
    measureType: 'height' | 'width';
    scrollPosition: 'scrollY' | 'scrollX';
  };

  /** Callback called when key down events are detected */
  private handleKeyDownCallback = ($event: KeyboardEvent) => {
    if (this.document == null) {
      this.document = document;
      this.document.addEventListener('click', this.handleOutsideClick);
    }

    this.scroll($event);
  };

  /** elementRef mutations observer */
  private mutationsObserver: MutationObserver;

  /** indicates that there is an item to be focused on */
  private toUpdateFocus: boolean = false;

  /** The gap between the HTMLElements */
  public itemsGap: number;

  /** The item to receive focus */
  public itemToFocus: any;

  /** The key nav directive's config */
  public config: KeyNavConfig;

  /** The document object */
  private document: Document;

  /** The first item on the list */
  private firstItemFocus: HTMLElement;

  /** The last focus interaction made on the first item */
  private lastInteractionType: 'keyboard' | 'mouse' = null;

  /** This is used to give the focus class to th first item */
  private firstItemFocusCallback = () => {
    if (this.lastInteractionType === 'mouse') return;

    if (this.config.elemFocusClass) {
      if (this.elemToFocus) {
        this.config.scrollerRef.shadowRoot.querySelector(`.${this.config.elemToFocus}:not([tabindex="-1"]) .${this.config.elemFocusClass}.focus`)?.classList?.remove('focus');
      }

      this.elemToFocus = this.firstItemFocus;
      this.config.scrollerRef.shadowRoot.activeElement.querySelector(`.${this.config.elemFocusClass}`)?.classList?.add('focus');
    }
  };

  /** This is used to monitor the last interaction made on the list's first item */
  private firstItemMouseDownCallback = () => {
    this.lastInteractionType = 'mouse';
  };

  /** This is used to monitor the last interaction made on the list's first item */
  private firstItemKeyDownCallback = () => {
    this.lastInteractionType = 'keyboard';
  };

  //#endRegion LOCAL VARIABLES

  //#region COMPONENT METHODS

  constructor(config: KeyNavConfig) {
    this.config = new KeyNavConfig(config);

    const gap: string = window.getComputedStyle(this.config.containerRef, null).getPropertyValue('gap');

    this.itemsGap = !isNaN(Number(gap.replace('px', ''))) ? Number(gap.replace('px', '')) : 0;

    this.updateScrollConfig();
    this.updateListItems();
    this.initEventListeners();

    if (this.config.focusFirstItem && this.listItems.length) {
      requestAnimationFrame(() => {
        this.focusElement(0);
      });
    }
  }

  /**
   * Retrieves a list of key navigable items within the specified HTMLElement and then updates the item's event listeners
   */
  public updateListItems() {
    this.listItems = Array.from(this.config.scrollerRef.shadowRoot.querySelectorAll(`.${this.config.elemToFocus}:not([tabindex="-1"])`));

    if (this.listItems?.length && !this.firstItemFocus) {
      this.firstItemFocus = this.listItems[0];
      this.firstItemFocus.addEventListener('mousedown', this.firstItemMouseDownCallback);
      this.firstItemFocus.addEventListener('keydown', this.firstItemKeyDownCallback);
      this.firstItemFocus.addEventListener('focus', this.firstItemFocusCallback);
    } else if (!this.listItems?.length && this.firstItemFocus) {
      this.firstItemFocus.removeEventListener('mousedown', this.firstItemMouseDownCallback);
      this.firstItemFocus.removeEventListener('keydown', this.firstItemKeyDownCallback);
      this.firstItemFocus.removeEventListener('focus', this.firstItemFocusCallback);
      this.firstItemFocus = null;
    }
  }
  /** Gets the element and gives focus to it */
  private updateFocusedElem() {
    if (this.elemToFocus) this.elemToFocus.focus({ preventScroll: true });
    this.toUpdateFocus = false;
  }

  /** Updates the scroll config */
  public updateScrollConfig() {
    if (this.config.direction === Direction.Vertical) {
      this.scrolConfig = {
        scrollType: 'scrollTop',
        measureType: 'height',
        scrollPosition: 'scrollY',
      };
    } else {
      this.scrolConfig = {
        scrollType: 'scrollLeft',
        measureType: 'width',
        scrollPosition: 'scrollX',
      };
    }
  }

  /** Initializing the event listeners */
  private initEventListeners() {
    /** Callback called when key down events are detected */
    this.config.scrollerRef.addEventListener('keydown', this.handleKeyDownCallback);

    this.document = document;
    this.document.addEventListener('click', this.handleOutsideClick);
    this.config.scrollerRef.addEventListener('click', this.handleListClick);

    this.mutationsObserver = new MutationObserver(_mutations => {
      if (this.toUpdateFocus) {
        this.updateFocusedElem();
      }

      this.updateListItems();
    });

    this.mutationsObserver.observe(this.config.containerRef, { childList: true });
  }

  /** Destroying the event listeners */
  public destroyEventListeners() {
    /** Callback called when key down events are detected */
    this.config.scrollerRef.removeEventListener('keydown', this.handleKeyDownCallback);

    if (this.document) {
      this.document.removeEventListener('click', this.handleOutsideClick);
      this.document = null;
    }

    this.config.scrollerRef.removeEventListener('click', this.handleListClick);

    if (this.mutationsObserver) {
      this.mutationsObserver.disconnect();
      this.mutationsObserver = null;
    }

    if (this.firstItemFocus) {
      this.firstItemFocus.removeEventListener('mousedown', this.firstItemMouseDownCallback);
      this.firstItemFocus.removeEventListener('keydown', this.firstItemKeyDownCallback);
      this.firstItemFocus.removeEventListener('focus', this.firstItemFocusCallback);
      this.firstItemFocus = null;
    }
  }

  /** This method is used to give focus to an list element */
  public focusElement(index) {
    if (!this.listItems?.length) return;

    this.elemToFocus = this.listItems[index];
    this.elemToFocus.focus();
    if (this.config.elemFocusClass) this.config.scrollerRef.shadowRoot.activeElement.querySelector(`.${this.config.elemFocusClass}`)?.classList?.add('focus');
  }

  /** Gets the element to be focused upon  */
  private getElemFocus($event: KeyboardEvent) {
    if (!this.config.tabNavigation && $event.key === 'Tab') {
      $event.preventDefault();
      $event.stopPropagation();
      return;
    }
    if (($event.key === 'Tab' && $event.shiftKey) || ['ArrowUp', 'ArrowLeft'].includes($event.key)) {
      $event.preventDefault();
      $event.stopPropagation();
      this.getPreviousElement($event);
    } else if ($event.key === 'Tab' || ['ArrowDown', 'ArrowRight'].includes($event.key)) {
      $event.preventDefault();
      $event.stopPropagation();
      this.getNextElement($event);
    }
  }

  /**
   * Focuses on the next key navigable element in the list.
   */
  private getNextElement($event: KeyboardEvent) {
    const activeElement = this.config.scrollerRef.shadowRoot.activeElement as HTMLElement;
    const currentlyFocusedIndex: number = activeElement ? Number(this.listItems.indexOf(activeElement)) : null;

    let nextIndex: number;
    if ((this.config.direction === Direction.Vertical && $event.key === 'ArrowDown') || (this.config.direction === Direction.Horizontal && $event.key === 'ArrowRight')) {
      nextIndex = currentlyFocusedIndex != null ? currentlyFocusedIndex + 1 : 0;
      if (nextIndex > this.listItems.length - 1) {
        nextIndex = this.listItems.length - 1;
      }
    } else {
      nextIndex = currentlyFocusedIndex != null ? (currentlyFocusedIndex + 1) % this.listItems.length : 0;
    }

    this.elemToFocus = this.listItems[nextIndex];
  }

  /**
   * Focuses on the previous key navigable element in the list.
   */
  private getPreviousElement($event: KeyboardEvent) {
    const activeElement = this.config.scrollerRef.shadowRoot.activeElement as HTMLElement;
    const currentlyFocusedIndex: number = activeElement ? Number(this.listItems.indexOf(activeElement)) : null;

    let previousIndex: number;

    if ((this.config.direction === Direction.Vertical && $event.key === 'ArrowUp') || (this.config.direction === Direction.Horizontal && $event.key === 'ArrowLeft')) {
      previousIndex = currentlyFocusedIndex != null ? currentlyFocusedIndex - 1 : 0;
      if (previousIndex < 0) previousIndex = 0;
    } else {
      previousIndex = currentlyFocusedIndex != null ? (currentlyFocusedIndex - 1 + this.listItems.length) % this.listItems.length : 0;
    }

    this.elemToFocus = this.listItems[previousIndex];
  }

  /** Responsible to scroll to the next navigatable element */
  private scroll($event: KeyboardEvent) {
    if (!this.config.tabNavigation && $event.key === 'Tab') {
      $event.preventDefault();
      $event.stopPropagation();
      return;
    }

    if (($event.key === 'Tab' && $event.shiftKey) || ['ArrowUp', 'ArrowLeft'].includes($event.key)) {
      $event.preventDefault();
      $event.stopPropagation();
      this.scrollPreviousElement($event);
    } else if ($event.key === 'Tab' || ['ArrowDown', 'ArrowRight'].includes($event.key)) {
      $event.preventDefault();
      $event.stopPropagation();
      this.scrollNextElement($event);
    }
  }

  /** Responsible to scroll to the previous element */
  private scrollPreviousElement($event) {
    let itemTarget: any;

    for (let elem of $event.composedPath()) {
      if (elem?.classList && Array.from(elem.classList).includes('viewport-item')) {
        itemTarget = elem;
        break;
      }
    }

    if (!itemTarget) {
      if (this.elemToFocus) {
        if (this.config.elemFocusClass) this.elemToFocus.querySelector(`.${this.config.elemFocusClass}`)?.classList?.remove('focus');
        this.elemToFocus = null;
      }
      return;
    }

    const scroll = this.config.scrollerRef[this.scrolConfig.scrollType];

    const itemSize = itemTarget.getBoundingClientRect()[this.scrolConfig.measureType];

    const itemIndex: number = Number(itemTarget.getAttribute('index'));

    const itemPosition = (itemIndex * itemSize + itemIndex * this.itemsGap - itemSize - this.itemsGap) / this.config.itemsPerGroup;

    if (this.config.elemFocusClass && this.elemToFocus) {
      this.config.scrollerRef.shadowRoot.querySelector(`.${this.config.elemToFocus}:not([tabindex="-1"]) .${this.config.elemFocusClass}.focus`)?.classList?.remove('focus');
    }

    this.getElemFocus($event);

    if (itemPosition < scroll) {
      this.config.scrollerRef.scrollToPreviousItem();
      this.elemToFocus.focus({ preventScroll: true });
      this.toUpdateFocus = true;
    } else {
      this.elemToFocus.focus({ preventScroll: true });
    }

    if (this.config.elemFocusClass) {
      this.config.scrollerRef.shadowRoot.activeElement.querySelector(`.${this.config.elemFocusClass}`)?.classList?.add('focus');
    }
  }

  /** Responsible to scroll to the next element */
  private scrollNextElement($event) {
    let itemTarget: any;

    for (let elem of $event.composedPath()) {
      if (elem?.classList && Array.from(elem.classList).includes('viewport-item')) {
        itemTarget = elem;
        break;
      }
    }

    if (!itemTarget) {
      if (this.elemToFocus) {
        if (this.config.elemFocusClass) {
          this.config.scrollerRef.shadowRoot.querySelector(`.${this.config.elemToFocus}:not([tabindex="-1"]) .${this.config.elemFocusClass}.focus`)?.classList?.remove('focus');
        }
        this.elemToFocus = null;
      }
      return;
    }

    const scrollerSize = this.config.scrollerRef.getBoundingClientRect()[this.scrolConfig.measureType];
    const scroll = this.config.scrollerRef[this.scrolConfig.scrollType];

    const itemSize = itemTarget.getBoundingClientRect()[this.scrolConfig.measureType];

    const itemIndex: number = Number(itemTarget.getAttribute('index')) + 1;

    const itemPosition = (itemIndex * itemSize + itemIndex * this.itemsGap + itemSize + this.itemsGap) / this.config.itemsPerGroup;

    if (this.config.elemFocusClass && this.elemToFocus) {
      this.config.scrollerRef.shadowRoot.querySelector(`.${this.config.elemToFocus}:not([tabindex="-1"]) .${this.config.elemFocusClass}.focus`)?.classList?.remove('focus');
    }

    this.getElemFocus($event);

    if (itemPosition > scroll + scrollerSize) {
      this.config.scrollerRef.scrollToNextItem();
      this.elemToFocus.focus({ preventScroll: true });
      this.toUpdateFocus = true;
    } else {
      this.elemToFocus.focus({ preventScroll: true });
    }

    if (this.config.elemFocusClass) this.config.scrollerRef.shadowRoot.activeElement.querySelector(`.${this.config.elemFocusClass}`)?.classList?.add('focus');
  }

  /** When clicking outside of the list, this function removes the focus from the last focused element */
  private handleOutsideClick = ($event: MouseEvent) => {
    if (!$event.composedPath().includes(this.config.scrollerRef)) {
      if (this.elemToFocus) {
        if (this.config.elemFocusClass) {
          this.config.scrollerRef.shadowRoot.querySelector(`.${this.config.elemToFocus}:not([tabindex="-1"]) .${this.config.elemFocusClass}.focus`)?.classList?.remove('focus');
        }
        this.elemToFocus = null;
      }
      this.document.removeEventListener('click', this.handleOutsideClick);
      this.document = null;
      return;
    }
  };

  /** When clicking inside of the list, this function gives the focus class to the focused element and removes the focus class from the last focused element */
  private handleListClick = ($event: MouseEvent) => {
    if (this.document == null) {
      this.document = document;
      this.document.addEventListener('click', this.handleOutsideClick);
    }

    let composedPath = $event.composedPath() as HTMLElement[];
    let itemTarget: HTMLElement;

    for (let elem of composedPath) {
      if (elem?.classList && Array.from(elem.classList).includes('viewport-item')) {
        itemTarget = elem;
        break;
      }
    }

    if (!itemTarget) {
      if (this.elemToFocus) {
        if (this.config.elemFocusClass) {
          this.config.scrollerRef.shadowRoot.querySelector(`.${this.config.elemToFocus}:not([tabindex="-1"]) .${this.config.elemFocusClass}.focus`)?.classList?.remove('focus');
        }
        this.elemToFocus = null;
      }
      return;
    }

    if (this.elemToFocus && this.elemToFocus !== itemTarget)
      if (this.config.elemFocusClass) {
        this.config.scrollerRef.shadowRoot.querySelector(`.${this.config.elemToFocus}:not([tabindex="-1"]) .${this.config.elemFocusClass}.focus`)?.classList?.remove('focus');
      }

    this.elemToFocus = itemTarget;
    if (this.config.elemFocusClass) this.config.scrollerRef.shadowRoot.activeElement.querySelector(`.${this.config.elemFocusClass}`)?.classList?.add('focus');
  };

  //#endRegion COMPONENT METHODS
}
