import { Direction } from '../../misc/enums/direction.enum';
import { KeyNavConfig } from './models/np-key-nav.model';

export class NpKeyNav {
  //#region LOCAL VARIABLES

  /** The index of the currently focused item */
  private currentlyFocusedIndex: number = null;

  /** element to focus while navigating */
  private elemToFocus: any = null;

  /** The list of list elements */
  private listItems: Array<HTMLElement> = [];

  /** The Previous list of list elements (used validate which elements were added/removed, as to add/remove event listeners) */
  private previousListItems: Array<HTMLElement> = [];

  /** Virtuall scrollerRef configs, they dependend on the scrollerRef direction */
  private scrolConfig: {
    scrollType: 'scrollTop' | 'scrollLeft';
    measureType: 'height' | 'width';
    scrollPosition: 'scrollY' | 'scrollX';
  };

  /** Callback called when key down events are detected */
  private handleKeyDownCallback = ($event: KeyboardEvent) => {
    if (this.config.scrollerRef) {
      this.scroll($event);
    } else {
      this.getElemFocus($event);
      this.elemToFocus.focus({ preventScroll: true });
    }
  };

  /** elementRef mutations observer */
  private mutationsObserver: MutationObserver;

  /** The gap between the HTMLElements */
  public itemsGap: number;

  /** The key nav directive's config */
  public config: KeyNavConfig;

  //#endRegion LOCAL VARIABLES

  //#region COMPONENT METHODS

  constructor(config: KeyNavConfig) {
    this.config = new KeyNavConfig(config);

    const gap = window.getComputedStyle(this.config.containerRef, null).getPropertyValue('gap');
    this.itemsGap = !isNaN(Number(gap.replace('px', ''))) ? Number(gap.replace('px', '')) : 0;

    if (this.config.scrollerRef) this.updateScrollConfig();

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
    this.listItems = Array.from(this.config.containerRef.querySelectorAll(`.${this.config.itemClassName}:not([tabindex="-1"])`));
    this.updateItemsAddEventListeners();
    this.previousListItems = this.listItems;
  }

  /** If and item is added, then we add an event listener to it
   * and if an item is removed, we remove the event listener related to it
   */
  private updateItemsAddEventListeners() {
    if (this.previousListItems.length) {
      this.previousListItems.forEach(previousItem => {
        if (!this.listItems.includes(previousItem)) {
          if (this.elemToFocus === previousItem) {
            this.elemToFocus = null;
            this.currentlyFocusedIndex = null;
          }
          previousItem.removeEventListener('focusin', this.updateCurrentlyFocused);
        }
      });

      this.listItems.forEach(item => {
        if (!this.previousListItems.includes(item)) {
          item.addEventListener('focusin', this.updateCurrentlyFocused);
        }
      });
    } else {
      this.listItems.forEach(item => {
        item.addEventListener('focusin', this.updateCurrentlyFocused);
      });
    }
  }

  /** Saves the currently focused item */
  private updateCurrentlyFocused = $event => {
    this.currentlyFocusedIndex = this.listItems.indexOf($event.composedPath()[0]);
  };

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
    this.config.containerRef.addEventListener('keydown', this.handleKeyDownCallback);

    this.mutationsObserver = new MutationObserver(_mutations => {
      this.listItems = Array.from(this.config.containerRef.querySelectorAll(`.${this.config.itemClassName}:not([tabindex="-1"])`));
      this.updateItemsAddEventListeners();
      this.previousListItems = this.listItems;
    });

    this.mutationsObserver.observe(this.config.containerRef, { childList: true });
  }

  /** Destroying the event listeners */
  public destroyEventListeners() {
    /** Callback called when key down events are detected */
    this.config.containerRef.removeEventListener('keydown', this.handleKeyDownCallback);

    this.listItems.forEach(item => {
      item.removeEventListener('focusin', this.updateCurrentlyFocused);
    });

    if (this.mutationsObserver) {
      this.mutationsObserver.disconnect();
      this.mutationsObserver = null;
    }
  }

  /** This method is used to give focus to an list element */
  public focusElement(index) {
    if (!this.listItems?.length) return;

    this.elemToFocus = this.listItems[index];
    this.elemToFocus.focus({ preventScroll: true });
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
    let nextIndex: number;
    let itemsPerGroup: number;
    if ((this.config.direction === Direction.Vertical && $event.key === 'ArrowDown') || (this.config.direction === Direction.Horizontal && $event.key === 'ArrowRight')) {
      itemsPerGroup = this.listItems.length / this.config.itemsPerGroup;

      nextIndex = this.currentlyFocusedIndex != null ? this.currentlyFocusedIndex + this.listItems.length / itemsPerGroup : 0;

      if (nextIndex > this.listItems.length - 1) {
        nextIndex = this.listItems.length - 1;
      }
    } else {
      nextIndex = this.currentlyFocusedIndex != null ? (this.currentlyFocusedIndex + 1) % this.listItems.length : 0;
    }

    this.elemToFocus = this.listItems[nextIndex];
  }

  /**
   * Focuses on the previous key navigable element in the list.
   */
  private getPreviousElement($event: KeyboardEvent) {
    let previousIndex: number;
    let itemsPerGroup: number;
    if ((this.config.direction === Direction.Vertical && $event.key === 'ArrowUp') || (this.config.direction === Direction.Horizontal && $event.key === 'ArrowLeft')) {
      itemsPerGroup = this.listItems.length / this.config.itemsPerGroup;
      previousIndex = this.currentlyFocusedIndex != null ? this.currentlyFocusedIndex - this.listItems.length / itemsPerGroup : 0;

      if (previousIndex < 0) previousIndex = 0;
    } else {
      previousIndex = this.currentlyFocusedIndex != null ? (this.currentlyFocusedIndex - 1 + this.listItems.length) % this.listItems.length : 0;
    }

    this.elemToFocus = this.listItems[previousIndex];
  }

  /** Responsible to scroll to the next navigatable element */
  private scroll($event: KeyboardEvent) {
    if (!this.config.tabNavigation && $event.key === 'Tab') {
      $event.preventDefault();
      $event.stopPropagation();

      if (this.elemToFocus == null && this.listItems.length) {
        this.elemToFocus = this.listItems[0];
        this.elemToFocus.focus();
      }
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
      if (elem?.classList && Array.from(elem.classList).includes(this.config.itemClassName)) {
        itemTarget = elem;
        break;
      }
    }

    if (!itemTarget) return;

    const scroll = this.config.scrollerRef[this.scrolConfig.scrollType];

    const itemSize = itemTarget.getBoundingClientRect()[this.scrolConfig.measureType];

    const itemIndex: number = Number(itemTarget.getAttribute('index'));

    const itemPosition = (itemIndex * itemSize + itemIndex * this.itemsGap - itemSize - this.itemsGap) / this.config.itemsPerGroup;
    this.getElemFocus($event);

    if (itemPosition < scroll) {
      this.elemToFocus.scrollIntoView(true);
    }
    this.elemToFocus.focus({ preventScroll: true });
  }

  /** Responsible to scroll to the next element */
  private scrollNextElement($event) {
    let itemTarget: any;

    for (let elem of $event.composedPath()) {
      if (elem?.classList && Array.from(elem.classList).includes(this.config.itemClassName)) {
        itemTarget = elem;
        break;
      }
    }

    if (!itemTarget) return;

    const scrollerSize = this.config.scrollerRef.getBoundingClientRect()[this.scrolConfig.measureType];
    const scroll = this.config.scrollerRef[this.scrolConfig.scrollType];

    const itemSize = itemTarget.getBoundingClientRect()[this.scrolConfig.measureType];

    const itemIndex: number = Number(itemTarget.getAttribute('index')) + 1;

    const itemPosition = (itemIndex * itemSize + itemIndex * this.itemsGap + itemSize + this.itemsGap + this.itemsGap) / this.config.itemsPerGroup;

    this.getElemFocus($event);

    if (itemPosition > scroll + scrollerSize) {
      this.elemToFocus.scrollIntoView(false);
    }
    this.elemToFocus.focus({ preventScroll: true });
  }

  //#endRegion COMPONENT METHODS
}
