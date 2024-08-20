import { Direction } from '../../../../../utils/misc/enums/direction.enum';

export class KeyNavConfig {
  /** The Item's parent */
  containerRef: HTMLElement;

  /** The element that gives height to the scroll bar */
  scrollerRef: HTMLNpVirtualScrollerElement;

  /** Enables tab navigation */
  tabNavigation?: boolean;

  /** In case of direction === 'vertical', this will be the number of collumns. In case of direction === 'horizontal', this will be the number of rows */
  itemsPerGroup?: number;

  /**  The direction of the list of items */
  direction?: Direction;

  /** If true, focus on the first item on the list */
  focusFirstItem?: boolean;

  /** The element to give focus to */
  elemToFocus: string;

  /** if this element is given, then it will receive the focus class */
  elemFocusClass?: string;

  constructor(config) {
    this.containerRef = config.containerRef;
    this.scrollerRef = config.scrollerRef;
    this.tabNavigation = config?.tabNavigation ?? true;
    this.itemsPerGroup = config?.itemsPerGroup ?? 1;
    this.direction = config?.direction ?? Direction.Vertical;
    this.focusFirstItem = config?.focusFirstItem ?? false;
    this.elemToFocus = config?.elemToFocus;
    this.elemFocusClass = config?.elemFocusClass;
  }
}
