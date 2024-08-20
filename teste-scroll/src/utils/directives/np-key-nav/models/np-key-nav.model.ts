import { Direction } from '../../../misc/enums/direction.enum';

export class KeyNavConfig {
  /** The Item's parent */
  containerRef: HTMLElement;

  /** The class of the items */
  itemClassName: string;

  /** The element that gives height/width to the scroll bar */
  scrollerRef?: HTMLElement;

  /** Enables tab navigation */
  tabNavigation?: boolean;

  /** In case of direction === 'vertical', this will be the number of collumns. In case of direction === 'horizontal', this will be the number of rows */
  itemsPerGroup?: number;

  /**  The direction of the list of items */
  direction?: Direction;

  /** If true, focus on the first item on the list */
  focusFirstItem?: boolean;

  constructor(config) {
    this.containerRef = config.containerRef;
    this.itemClassName = config.itemClassName;
    this.scrollerRef = config?.scrollerRef;
    this.tabNavigation = config?.tabNavigation ?? true;
    this.itemsPerGroup = config?.itemsPerGroup ?? 1;
    this.direction = config?.direction ?? Direction.Vertical;
    this.focusFirstItem = config?.focusFirstItem ?? false;
  }
}
