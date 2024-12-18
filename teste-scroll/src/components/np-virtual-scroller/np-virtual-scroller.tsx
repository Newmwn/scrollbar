import { Component, Element, Event, EventEmitter, Host, Method, Prop, State, VNode, Watch, h } from '@stencil/core';
import { TBU } from '../../utils/helpers/tbu';
import { Direction } from '../../utils/misc/enums/direction.enum';
import { NpVirtualKeyNav } from './helpers/np-virtual-key-nav';

@Component({
  tag: 'np-virtual-scroller',
  styleUrls: { desktop: 'np-virtual-scroller.scss' },
  shadow: true,
})
export class NpVirtualScroller {
  //#region Elements
  @Element() host: HTMLNpVirtualScrollerElement;
  itemContainerRef: HTMLDivElement;
  //#endregion Elements

  //#region PROPS

  /** The list of items that will populate the virtual scroll list */
  @Prop({ attribute: 'viewPortItems' }) viewPortItems: Array<any> = [];
  @Watch('viewPortItems') watchItems(newValue) {
    if (newValue.length === 0) {
      this.scrollValue = 0;
      this.totalSize = 0;
      this.children = [];
      return;
    }

    // to render an ghost item to get the item dimension (width or height)
    if (this[this.virtualScrolConfig?.itemMeasureType] <= 0) return;

    this.updateScrollSize();
  }

  /** Array of unique Identifiers for comparation between items, This is used to optimize the list performance when adding, removing or changing the position of list items */
  @Prop() identifiers: Array<any> = ['id'];

  /** this callback will emit the index of the list item to be rendered */
  @Prop({ attribute: 'itemTemplate' })
  itemTemplate!: ((viewPortItem: any, index: number) => VNode | string) | any;

  /** Future feature implementation
   *
   *   // Use this when the height varies between item
      @Prop({ attribute: 'itemWidths' })
      itemWidths: number[] = [];

      // Future feature implementation
      // Use this when the height varies between item
      @Prop({ attribute: 'itemHeights' })
      itemHeights: number[] = [];
   *
   */

  /** the gap between list items */
  _gap: number;
  @Prop() gap: number = 12;
  @Watch('gap') watchGap(newGap: number) {
    this._gap = newGap;
    this.updateScrollSize();
  }

  /** In case of direction === 'vertical', this will be the number of collumns. In case of direction === 'horizontal', this will be the number of rows */
  @Prop({ mutable: true, attribute: 'itemsPerGroup' }) itemsPerGroup = 1;
  @Watch('itemsPerGroup') watchItemsPerGroup(newItemsPerGroup) {
    if (this.keyboardNavigation && this.keyNav && newItemsPerGroup) this.keyNav.config.itemsPerGroup = newItemsPerGroup;
    this.updateScrollSize();
  }

  /** the direction of the virtuall scroller */
  @Prop() direction: Direction = Direction.Vertical;
  @Watch('direction') watchDirection(newDirection: Direction) {
    if (this.keyboardNavigation && this.keyNav) {
      this.keyNav.config.direction = newDirection;
      this.keyNav.updateScrollConfig();
    }

    this.updateScrollConfig();

    this.itemHeight = this.itemWidth = null;
  }

  /** Custom Grid Template Style */
  @Prop({ attribute: 'customGridTemplateStyle' }) customGridTemplateStyle: string = null;

  /** Custom Grid Auto Flow Style */
  @Prop({ attribute: 'customAutoFlowStyle' }) customAutoFlowStyle: string = null;

  /** Styles to be applied to the item container */
  @Prop({ attribute: 'itemContainerStyles' }) itemContainerStyles: any = {};

  /** Styles to be applied to the item wrapper */
  @Prop({ attribute: 'viewPortItemStyles' }) viewPortItemStyles: any = {};

  /** if set to true, virtual scroller will listen to resize events,
   * this is usefull because when there are more visible items we need more items need to be rendered, so that the scroller continues being fast
   */
  @Prop({ attribute: 'isResizable' }) isResizable: boolean = false;
  @Watch('isResizable') watchIsResizable(isResizable) {
    if (isResizable && this.scrollerResizeObserver == null) {
      this.observeScrollerResize();
    } else if (!isResizable && this.scrollerResizeObserver != null) {
      this.scrollerResizeObserver.disconnect();
      this.scrollerResizeObserver = null;
    }
  }

  /** if true, list navigation via keyboard will be available  */
  @Prop({ attribute: 'keyboardNavigation' }) keyboardNavigation: boolean = true;
  @Watch('keyboardNavigation') watchkeyboardNavigation(newValue) {
    if (newValue) {
      this.keyNav = new NpVirtualKeyNav({
        containerRef: this.itemContainerRef,
        scrollerRef: this.host,
        elemToFocus: this.elemToFocus,
        elemFocusClass: this.elemFocusClass,
        tabNavigation: this.tabNavigation,
        itemsPerGroup: this.itemsPerGroup,
        direction: this.direction,
      });
    } else {
      this.keyNav.destroyEventListeners();
      this.keyNav = null;
    }
  }

  /** if true, list navigation via tab will be available  */
  @Prop({ attribute: 'tabNavigation' }) tabNavigation: boolean = false;
  @Watch('tabNavigation') watchHasTabNavigation(newValue) {
    if (this.keyboardNavigation && this.keyNav) this.keyNav.config.tabNavigation = newValue;
  }

  /** If true, focus on the first item on the list */
  @Prop({ attribute: 'focusFirstItem' }) focusFirstItem?: boolean = false;
  @Watch('focusFirstItem') watchFocusFirstItem(newValue) {
    if (this.keyNav) this.keyNav.config.focusFirstItem = newValue;
  }

  /** The element to give focus to */
  @Prop({ attribute: 'elemToFocus' }) elemToFocus?: string;
  @Watch('elemToFocus') watchElemFocus(newElemClass: string) {
    if (this.keyNav) this.keyNav.config.elemToFocus = newElemClass;
  }

  /** if this element is given, then it will receive the focus class */
  @Prop({ attribute: 'elemFocusClass' }) elemFocusClass?: string;
  @Watch('elemFocusClass') watchElemFocusClass(newElemClass: string) {
    if (this.keyNav) this.keyNav.config.elemFocusClass = newElemClass;
  }

  /** Extra items to be rendered after and before the visible items */
  @Prop({ attribute: 'bufferItems' }) bufferItems?: number = 10;

  /** The amout of delay time to be applied in the throtle funciton on list scroll events*/
  @Prop({ attribute: 'scrollDelay' }) scrollDelay?: number = 100;

  /** The amout of delay time to be applied in the throtle funciton on list resize events*/
  @Prop({ attribute: 'resizeDelay' }) resizeDelay?: number = 100;

  /** Used when there are items in the virtuall scroller that aren't view port items, so to make the key nav work (temporary fix) */
  @Prop({ attribute: 'extraKeyNavIndex' }) extraKeyNavIndex?: number = 0;

  /** If this is set to true, the initial event listeners won't be added */
  @Prop({ attribute: 'ignoreInitialEventListeners' }) ignoreInitialEventListeners: boolean = false;


  //#endregion PROPS

  //#region EVENTS

  /** Called when the user starts scrolling */
  @Event() scrollStartEvent: EventEmitter<any>;

  /** Called whenever the user is scrolling */
  @Event() scrollEvent: EventEmitter<any>;

  /** Called when the user stops scrolling */
  @Event() scrollStopEvent: EventEmitter<any>;

  /** Called when the height of the virtuall scroller changes and emits it */
  @Event() scrollHeightChangeEvent: EventEmitter<number>;

  /** Called when the height and width of the virtual scroll item is calculated */
  @Event() itemSizeCalculatedEvent: EventEmitter<{ height: number, width: number }>;

  //#endregion EVENTS

  //#region LOCAL VARIABLES

  /** An list of IDs of the items that will populate the list */
  @State() children: Array<number> = [];

  /** virtuall scroller configs, they dependend on the scroller direction */
  virtualScrolConfig: {
    scrollType: 'scrollTop' | 'scrollLeft';
    measureType: 'height' | 'width';
    itemMeasureType: 'itemHeight' | 'itemWidth';
    scaleType: 'scaleX' | 'scaleY';
    translateType: 'translateX' | 'translateY';
    gridTemplateType: 'grid-template-rows' | 'grid-template-columns';
    gridAutoFlowType: 'row' | 'column';
  };

  /** the scroll value */
  scrollValue: number = 0;

  /** the total size of the scroll bar */
  totalSize: number = 1;

  /** Waiting args for throtle function */
  scrollWaitingArgs: boolean = true;

  /** Waiting args for throtle function */
  resizeWaitingArgs: boolean = true;

  /** if true, scroll events will be ignore */
  scrollUpdateShouldWait: boolean = false;

  /** if true, resize events will be ignore */
  resizeUpdateShouldWait: boolean = false;

  /** this is neccessary because getItemMeasure was being executed multiple times
   * and i only needed to execute getItemMeasure one time, the ghost item's reference changed multiple times during execution */
  gettingItemMeausure: boolean = false;

  /** Used to controll when the scrollStartEvent is emited  */
  firstScrollEvent: boolean = true;

  /** This variable stores the timeout used in the debounce function */
  scrollDebounceTimeout: any;

  /** This variable stores the timeout used in the debounce function */
  resizeDebouceTimeout: any;

  /**
   * Updates the rendered nodes the scroll value changes and when the itemPerGroup, viewPortItems and gap value changes
   * @param totalSizeChanged - if true, scrollbar size has changed
   * @returns
   */
  updateList = () => {
    if (this[this.virtualScrolConfig.itemMeasureType] <= 0) return;

    const bufferItems = this.host.getBoundingClientRect()[this.virtualScrolConfig.measureType] > 0 && this.componentLoaded ? this.bufferItems : this.bufferItems * 2 - 1;

    // First and last node that are visible
    const firstVisibleNode = Math.floor(this.host[this.virtualScrolConfig.scrollType] / (this[this.virtualScrolConfig.itemMeasureType] + this._gap)) * this.itemsPerGroup;

    const lastVisibleNode =
      Math.floor(
        (this.host[this.virtualScrolConfig.scrollType] + this.host.getBoundingClientRect()[this.virtualScrolConfig.measureType]) /
        (this[this.virtualScrolConfig.itemMeasureType] + this._gap),
      ) * this.itemsPerGroup;

    // First and last node that are rendered (may not be visible)
    const calculatingFirstRenderedNode = firstVisibleNode - bufferItems * this.itemsPerGroup < 0 ? 0 : firstVisibleNode - bufferItems * this.itemsPerGroup;
    const firstRenderedNodePosition =
      calculatingFirstRenderedNode % this.itemsPerGroup != 0 ? calculatingFirstRenderedNode - (calculatingFirstRenderedNode % this.itemsPerGroup) : calculatingFirstRenderedNode;

    const lastRenderedNodePosition =
      lastVisibleNode + bufferItems * this.itemsPerGroup > this.viewPortItems.length ? this.viewPortItems.length : lastVisibleNode + bufferItems * this.itemsPerGroup;

    let newChildren: Array<number> = [];

    const scroll =
      (Math.floor(this.host[this.virtualScrolConfig.scrollType] / (this[this.virtualScrolConfig.itemMeasureType] + this._gap)) - bufferItems < 0
        ? 0
        : Math.floor(this.host[this.virtualScrolConfig.scrollType] / (this[this.virtualScrolConfig.itemMeasureType] + this._gap)) - bufferItems) *
      (this[this.virtualScrolConfig.itemMeasureType] + this._gap);

    for (let i = firstRenderedNodePosition; i < lastRenderedNodePosition; i++) {
      newChildren.push(i);
    }

    if (this.children.length != newChildren.length) {
      this.scrollValue = scroll;
      this.children = [...newChildren];
    } else {
      for (let index = 0; index < this.children.length; index++) {
        if (this.children[index] != newChildren[index]) {
          this.scrollValue = scroll;
          this.children = [...newChildren];
          return;
        }
      }
    }
  };

  /** Called when an scroll event is invoked */
  scrollCallback: EventListenerOrEventListenerObject = $event => {
    if (this.firstScrollEvent) {
      this.scrollStartEvent.emit($event);
      this.firstScrollEvent = false;
    }
    this.scrollEvent.emit($event);
    this.scrollThrottle(this.updateList, this.scrollDelay);
    this.scrollDebounce($event);
  };

  /** Called when the virtuall scroller is resized (more visible items means that more items need to be rendered, so that the scroller continues being fast) */
  resizeCallback: Function = () => {
    if (
      this[this.virtualScrolConfig.itemMeasureType] <= 0 ||
      this.itemContainerRef.getBoundingClientRect().width <= 0 ||
      this.itemContainerRef.getBoundingClientRect().height <= 0 ||
      (this.direction === Direction.Vertical ? this.itemWidth <= 0 : this.itemHeight <= 0)
    )
      return;

    const gapSize = this.itemsPerGroup * this._gap - this._gap;
    const size = (this.direction === Direction.Vertical ? this.itemContainerRef.getBoundingClientRect().width : this.itemContainerRef.getBoundingClientRect().height) - gapSize;
    const itemSize = this.direction === Direction.Vertical ? this.itemWidth : this.itemHeight;

    const items = Math.floor(size / itemSize);
    const itemsPerGroup = items < 1 ? 1 : items;

    if (itemsPerGroup != this.itemsPerGroup) {
      this.itemsPerGroup = itemsPerGroup < 1 ? 1 : itemsPerGroup;
      this.updateScrollSize();
    }
  };

  /** Virtuall Scroller resize observer */
  scrollerResizeObserver: ResizeObserver;

  /** this callback an item to populate the view port */
  renderViewPortItem: (item, index) => VNode;

  /** This callback Renders an invisible item, to get the height and width */
  renderGhostItem: () => VNode;

  /** Key nav Helper */
  keyNav: NpVirtualKeyNav;

  /** The width of the virtuall scroller items, if the value is not set and it's an horizontal list or if it's a resizable list,
   * the width will be calculated, it's recomented in this case, if possible to specify the width, to improve performance
   */
  itemWidth: number = null;

  /** The height of the virtuall scroller items, if the value is not set and it's an vertical list or if it's a resizable list,
   * the height will be calculated, it's recomented in this case, if possible to specify the height, to improve performance
   */
  itemHeight: number = null;

  /** Indicates that the components has finished loading */
  componentLoaded: boolean = false;

  /** Indicates that the virtual scroller is listening to scroll events */
  scrollListener: boolean = false;

  //#endregion LOCAL VARIABLES

  //#region LIFE CYCLES
  connectedCallback() {
    if (!this.ignoreInitialEventListeners) {
      this.host.addEventListener('scroll', this.scrollCallback);
      this.scrollListener = true;
    }
  }

  componentWillLoad() {
    if (typeof this.itemTemplate === 'function') {
      this.renderViewPortItem = (item: any, index: number) => {
        return (
          <div style={this.viewPortItemStyles} class="viewport-item" key={this.generateUniqueId(item)} data-index={index}>
            {this.itemTemplate(item, index)}
          </div>
        );
      };
      this.renderGhostItem = () => {
        return (
          <div class="viewport-item ghost-item" style={{ opacity: '0' }} ref={ref => this.getItemMeasure(ref)}>
            {this.itemTemplate(this.viewPortItems[0], 0)}
          </div>
        );
      };
    } else {
      this.renderViewPortItem = (item: any, index: number) => {
        return (
          <div style={this.viewPortItemStyles} class="viewport-item" key={this.generateUniqueId(item)} data-index={index} innerHTML={this.renderAngularTemplate(item, index)}></div>
        );
      };
      this.renderGhostItem = () => {
        return (
          <div
            class="viewport-item ghost-item"
            style={{ opacity: '0' }}
            ref={ref => this.getItemMeasure(ref)}
            innerHTML={this.renderAngularTemplate(this.viewPortItems[0], 0)}
          ></div>
        );
      };
    }

    this.updateScrollConfig();
    this.watchGap(this.gap);
  }

  componentDidRender() {
    if (
      this.keyNav == null &&
      this.keyboardNavigation &&
      !(
        this[this.virtualScrolConfig.itemMeasureType] <= 0 ||
        (this.isResizable && ((this.direction === Direction.Horizontal && this.itemHeight <= 0) || (this.direction === Direction.Vertical && this.itemWidth <= 0)))
      )
    ) {
      this.keyNav = new NpVirtualKeyNav({
        containerRef: this.itemContainerRef,
        scrollerRef: this.host,
        elemToFocus: this.elemToFocus,
        elemFocusClass: this.elemFocusClass,
        tabNavigation: this.tabNavigation,
        itemsPerGroup: this.itemsPerGroup,
        direction: this.direction,
        focusFirstItem: this.focusFirstItem,
        extraIndex: this.extraKeyNavIndex,
        ignoreInitialEventListeners: this.ignoreInitialEventListeners
      });
    }

    if (this.itemHeight > 0 && this.itemWidth > 0) {
      this.componentLoaded = true;
    }

    if (!this.ignoreInitialEventListeners && this.isResizable && this.scrollerResizeObserver == null && this.itemHeight > 0 && this.itemWidth > 0) {
      this.observeScrollerResize();
    }
  }

  disconnectedCallback() {
    if (this.scrollListener) {
      this.host.removeEventListener('scroll', this.scrollCallback);
      this.scrollListener = false;
    }

    if (this.keyboardNavigation && this.keyNav) {
      this.keyNav.destroyEventListeners();
      this.keyNav = null;
    }

    if (this.isResizable && this.scrollerResizeObserver != null) {
      this.scrollerResizeObserver.disconnect();
      this.scrollerResizeObserver = null;
    }
  }

  //#endregion LIFE CYCLES

  //#region FUNCTION

  /** Here we use a throttle method to reduce the times that the callback function is executed  */
  scrollThrottle(callback, timeout) {
    if (this.scrollUpdateShouldWait) {
      this.scrollWaitingArgs = true;
      return;
    }

    const timeoutFunc = () => {
      if (!this.scrollWaitingArgs) {
        this.scrollUpdateShouldWait = false;
      } else {
        callback();
        this.scrollWaitingArgs = false;
        setTimeout(timeoutFunc);
      }
    };

    callback();

    this.scrollUpdateShouldWait = true;

    setTimeout(timeoutFunc, timeout);
  }

  /** Here we use a throttle method to reduce the times that the callback function is executed  */
  resizeThrottle(callback, timeout) {
    if (this.resizeUpdateShouldWait) {
      this.resizeWaitingArgs = true;
      return;
    }

    const timeoutFunc = () => {
      if (!this.resizeWaitingArgs) {
        this.resizeUpdateShouldWait = false;
      } else {
        callback();
        this.resizeWaitingArgs = false;
        setTimeout(timeoutFunc);
      }
    };

    callback();

    this.resizeUpdateShouldWait = true;

    setTimeout(timeoutFunc, timeout);
  }

  scrollDebounce($event) {
    clearTimeout(this.scrollDebounceTimeout);
    this.scrollDebounceTimeout = setTimeout(() => {
      this.firstScrollEvent = true;
      this.scrollStopEvent.emit($event);
    }, 150);
  }

  /** Updates the virtuall scroll's configs */
  updateScrollConfig() {
    if (this.direction === Direction.Vertical) {
      this.virtualScrolConfig = {
        scrollType: 'scrollTop',
        itemMeasureType: 'itemHeight',
        scaleType: 'scaleY',
        translateType: 'translateY',
        gridTemplateType: 'grid-template-columns',
        gridAutoFlowType: 'row',
        measureType: 'height',
      };
    } else {
      this.virtualScrolConfig = {
        scrollType: 'scrollLeft',
        itemMeasureType: 'itemWidth',
        scaleType: 'scaleX',
        translateType: 'translateX',
        gridTemplateType: 'grid-template-rows',
        gridAutoFlowType: 'column',
        measureType: 'width',
      };
    }
  }

  /** Updates the scroll size of the virtual scroller  */
  updateScrollSize() {
    if (this[this.virtualScrolConfig.itemMeasureType] <= 0) return;

    const size = this[this.virtualScrolConfig.itemMeasureType] * Math.ceil(this.viewPortItems.length / this.itemsPerGroup);

    /** Future feature implementation
     *  else {
          const itemsLenght = Math.ceil(this.viewPortItems.length / this.itemsPerGroup);
          // items with different sizes
          for (let i = 0; i < itemsLenght; i++) {
            size += this[`${this.virtualScrolConfig.itemMeasureType}s`][i];
          }
        }
     *
     */

    // Adding extra height related to the defined items gap
    let totalSize = size + Math.ceil(this.viewPortItems.length / this.itemsPerGroup) * this._gap;
    totalSize = totalSize - this._gap < 0 ? 0 : totalSize - this._gap;

    if (totalSize != this.totalSize) this.scrollHeightChangeEvent.emit(totalSize);

    this.totalSize = totalSize;

    this.updateList();
  }

  /** Observers virtual scroller resize events */
  observeScrollerResize() {
    this.resizeCallback();
    this.scrollerResizeObserver = new ResizeObserver(() => {
      this.resizeThrottle(this.resizeCallback, this.resizeDelay);
    });
    this.scrollerResizeObserver.observe(this.host);
  }

  /**
   * Optimizes the list performance when adding, removing or changing the position of list items
   * The item object
   */
  generateUniqueId(item: any) {
    if (!this.identifiers?.length || !item) return '';

    if (this.identifiers.length === 1) {
      return item[this.identifiers[0]];
    } else {
      let uid = '';

      this.identifiers.forEach(identifier => {
        uid += `${item[identifier]}`;
      });
      return uid;
    }
  }

  /**
   * Gets the measure of the ghost item (opacity "0")
   * @param itemRef - The reference of an item
   */
  getItemMeasure(itemRef) {
    if (this.gettingItemMeausure || itemRef == null) return;

    this.gettingItemMeausure = true;

    const getMeasure = (observer) => {
      const gap = window.getComputedStyle(this.itemContainerRef, null).getPropertyValue('gap').replace('px', '');
      this._gap = !isNaN(Number(gap)) ? Number(gap) : 0;

      const itemBoundingClientRect = itemRef.getBoundingClientRect();
      this.itemHeight = itemBoundingClientRect.height;
      this.itemWidth = itemBoundingClientRect.width;

      if (this.itemHeight > 0 && this.itemWidth > 0) {
        observer.disconnect();

        this.itemSizeCalculatedEvent.emit({ height: this.itemHeight, width: this.itemWidth });

        this.updateScrollSize();

        setTimeout(() => {
          this.gettingItemMeausure = false;
        });
      }
    };

    const ghostItemResizeObserver = new ResizeObserver((_entries, observer) => {
      getMeasure(observer);
    });

    ghostItemResizeObserver.observe(itemRef);
  }

  /**
   * This function let's us automatically scroll to a position in the list
   * @param scrollPosition - The position to scroll to
   * @param scrollingBehavior - The browser's scrolling behaviour
   */
  @Method() async scrollToPosition(scrollPosition: number = 0, scrollingBehavior: 'smooth' | 'instant' | 'auto' = 'instant') {
    const top = this.direction === Direction.Vertical ? scrollPosition : 0;
    const left = this.direction === Direction.Horizontal ? scrollPosition : 0;

    this.host.scroll({ top: top, left: left, behavior: scrollingBehavior });
  }

  /**
   * This function let's us automatically scroll to an item in the list via index
   * @param index - The index of the item
   * @param scrollingBehavior - The browser's scrolling behaviour
   */

  @Method() async scrollToIndex(index: number = 0, scrollingBehavior: 'smooth' | 'instant' | 'auto' = 'instant', itemIndex?: number) {
    const top = this.direction === Direction.Vertical && index > 0 ? index * this.itemHeight + index * this._gap : 0;
    const left = this.direction === Direction.Horizontal && index > 0 ? index * this.itemWidth + index * this._gap : 0;

    this.host.scroll({
      top: top,
      left: left,
      behavior: scrollingBehavior,
    });

    if (itemIndex == null) return;

    //This is used to fix an bug where the list doesn't correctly scroll to the given position
    const scrolToItem = (item = null) => {
      requestAnimationFrame(() => {
        item = this.itemContainerRef.querySelector(`[data-index="${itemIndex}"]`);
        if (item == null) {
          scrolToItem(item);
        } else {
          item.scrollIntoView();
        }
      });
    };

    scrolToItem();
  }

  /**
   * This function let's us automatically scroll to an item in the list
   * @param item - The item object
   * @param scrollingBehavior - The browser's scrolling behaviour
   */
  @Method() async scrollInto(item: any, scrollingBehavior: 'smooth' | 'instant' | 'auto' = 'instant') {
    const itemIndex = this.viewPortItems.indexOf(item);
    const index: number = Math.floor(itemIndex / this.itemsPerGroup);
    this.scrollToIndex(index, scrollingBehavior, itemIndex);
  }

  /**
   * This function scroll to the previous item thats hidden
   * @param scrollingBehavior - The scroll behaviour
   * @param extraValue - Extra scrolling value
   */
  @Method() async scrollToPreviousItem(scrollingBehavior: 'smooth' | 'instant' | 'auto' = 'instant', extraValue: number = 10 + this._gap) {
    const firstVisibleNode = Math.ceil(this.host[this.virtualScrolConfig.scrollType] / (this[this.virtualScrolConfig.itemMeasureType] + this._gap));
    const accSize = this[this.virtualScrolConfig.itemMeasureType] * firstVisibleNode + this._gap * firstVisibleNode;

    const top = this.direction === Direction.Vertical ? accSize - (this.itemHeight + this._gap + extraValue) : 0;
    const left = this.direction === Direction.Horizontal ? accSize - (this.itemWidth + this._gap + extraValue) : 0;

    this.host.scroll({
      top: top,
      left: left,
      behavior: scrollingBehavior,
    });
  }

  /**
   * This function scroll to the next item thats hidden
   * @param scrollingBehavior - The browser's scrolling behaviour
   * @param extraValue - Extra scrolling value
   */
  @Method() async scrollToNextItem(scrollingBehavior: 'smooth' | 'instant' | 'auto' = 'instant', extraValue = 10 + this._gap) {
    const firstVisibleNode = Math.floor(this.host[this.virtualScrolConfig.scrollType] / (this[this.virtualScrolConfig.itemMeasureType] + this._gap));
    const accSize = this[this.virtualScrolConfig.itemMeasureType] * firstVisibleNode + this._gap * firstVisibleNode;

    const top = this.direction === Direction.Vertical ? accSize + (this.itemHeight + this._gap + extraValue) : 0;
    const left = this.direction === Direction.Horizontal ? accSize + (this.itemWidth + this._gap + extraValue) : 0;

    this.host.scroll({
      top: top,
      left: left,
      behavior: scrollingBehavior,
    });
  }

  /** This public function serves to manually add events listener, based on the virtual scroller configuration
   * @param focusFirstItem - if true, the first item will be focused
   */
  @Method() async addEventListeners(focusFirstItem: boolean = false) {
    if (!this.scrollListener) {
      this.host.addEventListener('scroll', this.scrollCallback);
      this.scrollListener = true;
    }
    if (this.isResizable && this.scrollerResizeObserver == null) this.observeScrollerResize();

    if (this.keyNav) {
      this.keyNav.initEventListeners(focusFirstItem);
    }
  }

  /** This public function removes the active events listener from the virtual scroller */
  @Method() async removeEventListeners() {
    if (this.scrollListener) {
      this.host.removeEventListener('scroll', this.scrollCallback);
      this.scrollListener = false;
    }

    if (this.scrollerResizeObserver) {
      this.scrollerResizeObserver.disconnect();
      this.scrollerResizeObserver = null;
    }

    if (this.keyNav) {
      this.keyNav.destroyEventListeners();
    }
  }

  /** This public function returns the key nav helper */
  @Method() async getKeyNav() {
    return this.keyNav;
  }

  //#endregion FUNCTION

  //#region RENDER

  /** This function returns the html content of an ng-template */
  renderAngularTemplate(item: any, index: number): string {
    const embeddedView = this.itemTemplate.createEmbeddedView({
      item: item,
      index: index,
    });
    embeddedView.detectChanges();

    const rootNodes = embeddedView.rootNodes;
    const htmlContent: string = rootNodes.map(node => node.outerHTML).join('');

    return htmlContent;
  }

  render() {
    const itemContainerStyles = {
      'gap': TBU.tbu(TBU.px(this._gap)),
      'transform': `${this.virtualScrolConfig.translateType}(${TBU.tbu(TBU.px(this.scrollValue))})`,
      'grid-auto-flow': this.customAutoFlowStyle == null ? `${this.virtualScrolConfig.gridAutoFlowType}` : this.customAutoFlowStyle,
      [`${this.virtualScrolConfig.gridTemplateType}`]: this.customGridTemplateStyle == null ? `repeat(${this.itemsPerGroup}, 1fr)` : this.customGridTemplateStyle,
      ...this.itemContainerStyles,
    };

    return (
      <Host class={{ scrollbar: true, [this.direction]: true }}>
        <slot name="content-before-virtual-scroll"></slot>

        <div
          // to provide scroll height (in vertical mode) or width (in horizontal mode)
          class="scroll-size"
          style={{
            transform: `${this.virtualScrolConfig.scaleType}(${this.totalSize})`,
          }}
        />
        <div
          // items container
          ref={ref => (this.itemContainerRef = ref)}
          class={{ 'item-container': true, [this.direction]: true }}
          style={itemContainerStyles}
        >
          {
            // if the item height/width is not defined (undefined/null), this will render an ghost item (invisible) to get the item height/width
            (this[this.virtualScrolConfig.itemMeasureType] <= 0 ||
              (this.isResizable && ((this.direction === Direction.Horizontal && this.itemHeight <= 0) || (this.direction === Direction.Vertical && this.itemWidth <= 0)))) &&
              this.viewPortItems.length != 0
              ? this.renderGhostItem()
              : null
          }

          {
            // rendering the items
            this.children.map(index => {
              return this.renderViewPortItem(this.viewPortItems[index], index);
            })
          }
        </div>

        <slot name="content-after-virtual-scroll"></slot>
      </Host>
    );
  }

  //#endregion RENDER
}
