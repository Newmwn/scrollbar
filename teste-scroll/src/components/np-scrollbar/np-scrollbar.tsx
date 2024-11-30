import { Component, h, Host, Method, Prop, State, Watch } from '@stencil/core';
import { TBU } from '../../models';
import { ScrollbarPositionEnum, ScrollbarVisibilityEnum } from './models/np-scrollbar.enum';
import { ScrollStyleModel } from './models/np-scrollbar.model';

@Component({
  tag: 'np-scrollbar',
  styleUrl: 'np-scrollbar.scss',
  shadow: true,
})
export class NpScrollbar {
  //#region ELEMENTS

  /**
   * Zone to apply scroll
   * @name zoneToScroll
   * @type {HTMLElement}
   */
  zoneToScroll: HTMLElement;

  /**
   * Scroll container
   * @name scrollContainer
   * @type {HTMLElement}
   */
  scrollContainer: HTMLElement;

  /**
   * Scroll vertical thumb
   * @name thumbY
   * @type {HTMLElement}
   */
  thumbY: HTMLElement;

  /**
   * Scroll horizontal thumb
   * @name thumbX
   * @type {HTMLElement}
   */
  thumbX: HTMLElement;

  /**
   * Scroll content
   * @name content
   * @type {HTMLElement}
   * @description Area that will receive the content by slot
   */
  content: HTMLElement;
  //#endregion ELEMENTS

  //#region PROPS
  /**
   * Enable or disable the scrollbar
   * @name disabled
   * @type {boolean}
   * @default false
   */
  @Prop() disabled: boolean = false;

  /**
   * Enable or disable the full height on the scrollbar
   * @name fullHeight
   * @type {boolean}
   * @default false
   */
  @Prop({ attribute: 'fullHeight' }) fullHeight: boolean = false;

  @Prop({ attribute: 'scrollbarPosition' }) scrollbarPosition: ScrollbarPositionEnum = ScrollbarPositionEnum.AboveContent;

  @Prop({ attribute: 'scrollbarVisibility' }) scrollbarVisibility: ScrollbarVisibilityEnum = ScrollbarVisibilityEnum.HoverWithTrack;
  @Watch('scrollbarVisibility') watchScrollbarVisibility(newValue: ScrollbarVisibilityEnum) {
    switch (newValue) {
      case ScrollbarVisibilityEnum.Hover:
        this.visibilityClass = 'onHover';
        break;
      case ScrollbarVisibilityEnum.HoverWithTrack:
        this.visibilityClass = 'onHoverWithTrack';
        break;
      case ScrollbarVisibilityEnum.AlwaysVisible:
        this.visibilityClass = 'onAlways';
        break;
    }
  }

  /** Padding to apply on the scrollbar */
  @State() _padding: string = TBU.tbu(TBU.px(6));
  @Prop({ attribute: 'padding' }) padding: number = 6;
  @Watch('padding') watchPadding(newValue: number) {
    this._padding = TBU.tbu(TBU.px(newValue));
  }

  @State() _scrollStyles: ScrollStyleModel = {};
  @Prop({ attribute: 'scrollStyle' }) scrollStyles: ScrollStyleModel = {};
  @Watch('scrollStyleModel') watchScrollStyleModel(newValue: ScrollStyleModel) {
    this._scrollStyles = new ScrollStyleModel(newValue);
    this.scrollStylesYoApply = {
      '--margin-gap': TBU.tbu(TBU.px(this._scrollStyles.scrollbar.marginGap)),
      '--thumb-width': `${this._scrollStyles.thumb.width}px`,
      '--thumb-color': `var(--${this._scrollStyles.thumb.color})`,
      '--thumb-hover-color': `var(--${this._scrollStyles.thumb.hoverColor})`,
      '--thumb-active-color': `var(--${this._scrollStyles.thumb.activeColor})`,
      '--thumb-border-radius': `${this._scrollStyles.thumb.borderRadius}px`,
      '--track-width': TBU.tbu(TBU.px(this._scrollStyles.track.width)),
      '--track-color': `var(--${this._scrollStyles.track.color})`,
      '--track-hover-color': `var(--${this._scrollStyles.track.hoverColor})`,
      '--track-active-color': `var(--${this._scrollStyles.track.activeColor})`,
      '--track-border-radius': TBU.tbu(TBU.px(this._scrollStyles.track.borderRadius)),
    };
    if (this.scrollbarPosition == ScrollbarPositionEnum.NextToContent) {
      let minPadding = this._scrollStyles?.track?.width + this._scrollStyles?.scrollbar?.marginGap + 2;
      if (this.padding < minPadding) {
        this.padding = minPadding;
      }
    }
  }

  //#endregion PROPS

  //#region STATES
  @State() hasHorizontalScrollbar = true;
  @State() hasVerticalScrollbar = true;
  @State() thumbSizeY: number = 0;
  @State() thumbSizeX: number = 0;
  @State() mouseGapY: number = 0;
  @State() mouseGapX: number = 0;
  @State() scrollStylesYoApply: any = {};
  @State() visibilityClass: string = 'onHover';
  //#endregion STATES

  //#region LOCAL VARIABLES
  isDragging: boolean = false;
  scrollOrientation: string = 'vertical';
  //#endregion LOCAL VARIABLES

  //#region LIFE CICLES
  componentWillLoad() {
    this.watchPadding(this.padding);
    this.watchScrollStyleModel(this.scrollStyles);
    this.watchScrollbarVisibility(this.scrollbarVisibility);
  }
  componentDidLoad() {
    this.hasVerticalScrollbar = this.scrollContainer.scrollHeight > this.zoneToScroll.clientHeight;
    // Calculate the ratio between container height and content height
    const containerHeight = this.zoneToScroll.clientHeight;
    const containerWidth = this.zoneToScroll.clientWidth;
    const scrollHeight = this.scrollContainer.scrollHeight;
    const scrollWidth = this.scrollContainer.scrollWidth;
    if (scrollHeight > containerHeight) {
      const ratio = containerHeight / scrollHeight;
      // Calculate the thumb size as a percentage of the container height
      this.thumbSizeY = Math.max(ratio * containerHeight, 20); // Set a minimum size for the thumb
    }
    if (scrollWidth > containerWidth) {
      const ratio = containerWidth / scrollWidth;
      this.thumbSizeX = Math.max(ratio * containerWidth, 20);
    }
    this.scrollContainer.addEventListener('scroll', () => this.updateThumbPosition());
    document.addEventListener('mousemove', event => this.handleMouseMove(event));
    document.addEventListener('mouseup', () => {
      this.isDragging = false;
      this.mouseGapY = 0;
      this.mouseGapX = 0;
    });
  }
  //#endregion LIFE CICLES

  //#region PUBLIC METHODS
  @Method() async scrollToPosition(x?: number, y?: number, isPercentage: boolean = false) {
    const containerHeight = this.zoneToScroll.clientHeight;
    const containerWidth = this.zoneToScroll.clientWidth;
    const scrollHeight = this.scrollContainer.scrollHeight;
    const scrollWidth = this.scrollContainer.scrollWidth;

    const maxScrollTop = scrollHeight - containerHeight;
    const maxScrollLeft = scrollWidth - containerWidth;
    let scrollTop: number;
    let scrollLeft: number;

    if (isPercentage) {
      // If position is a percentage, calculate the scrollTop and scrollLeft based on the max values
      scrollTop = (y / 100) * maxScrollTop;
      scrollLeft = (x / 100) * maxScrollLeft;
    } else {
      // If position is a pixel value, clamp it within the valid scroll range
      scrollTop = Math.min(Math.max(y, 0), maxScrollTop);
      scrollLeft = Math.min(Math.max(x, 0), maxScrollLeft);
    }

    // Scroll the container to the calculated position
    this.scrollContainer.scrollTo({
      top: scrollTop,
      left: scrollLeft,
      behavior: 'smooth', // You can use 'smooth' for animated scrolling or 'auto' for instant scrolling
    });

    // Update the thumb position for vertical scroll
    this.updateThumbPosition();
  }

  //#endregion PUBLIC METHODS

  //#region COMPONENT FUNCTIONS

  handleMouseDown(event, orientation) {
    event.preventDefault(); // Prevent default browser behavior
    this.isDragging = true;
    this.scrollOrientation = orientation;

    const thumbRect = this.scrollOrientation === 'vertical' ? this.thumbY.getBoundingClientRect() : this.thumbX.getBoundingClientRect();

    this.mouseGapY = event.clientY - thumbRect.top;
    this.mouseGapX = event.clientX - thumbRect.left;
  }

  handleMouseMove(event) {
    if (this.isDragging) {
      const containerBounds = this.zoneToScroll.getBoundingClientRect();
      if (this.scrollOrientation == 'vertical') {
        // Calculate the new Y position of the thumb within the container, accounting for mouseGap
        const newY = event.clientY - containerBounds.top - this.mouseGapY;

        // Calculate the maximum Y position for the thumb
        const maxY = containerBounds.height - this.thumbSizeY;

        // Clamp the new Y position so the thumb doesn't go outside the scrollbar bounds
        const clampedY = Math.max(0, Math.min(newY, maxY));

        // Set the thumb's position
        this.thumbY.style.top = `${clampedY}px`;

        // Calculate the scroll percentage relative to the thumb's position
        const scrollPercentage = clampedY / maxY;

        // Calculate the final scroll position in the content
        const maxScrollTop = this.scrollContainer.scrollHeight - containerBounds.height;
        let scrollPosition = scrollPercentage * maxScrollTop;
        // Scroll the content based on the calculated position
        this.scrollContainer.scrollTo({
          top: scrollPosition,
          behavior: 'auto', // Use 'auto' for instant scrolling
        });
      } else if (this.scrollOrientation === 'horizontal') {
        // Calculate the new X position of the thumb within the container, accounting for mouseGap
        const newX = event.clientX - containerBounds.left - this.mouseGapX;

        // Calculate the maximum X position for the thumb
        const maxX = containerBounds.width - this.thumbSizeX;

        // Clamp the new X position so the thumb doesn't go outside the scrollbar bounds
        const clampedX = Math.max(0, Math.min(newX, maxX));

        // Set the thumb's position
        this.thumbX.style.left = `${clampedX}px`;

        // Calculate the scroll percentage relative to the thumb's position
        const scrollPercentage = clampedX / maxX;

        // Calculate the final scroll position in the content
        const maxScrollLeft = this.scrollContainer.scrollWidth - containerBounds.width;
        const scrollPosition = scrollPercentage * maxScrollLeft;

        // Scroll the content based on the calculated position
        this.scrollContainer.scrollTo({
          left: scrollPosition,
          behavior: 'auto', // Use 'auto' for instant scrolling
        });
      }
    }
  }

  updateThumbPosition() {
    const containerHeight = this.zoneToScroll.clientHeight;
    const containerWidth = this.zoneToScroll.clientWidth;
    const scrollHeight = this.scrollContainer.scrollHeight;
    const scrollWidth = this.scrollContainer.scrollWidth;

    if (this.hasVerticalScrollbar) {
      const maxScrollTop = scrollHeight - containerHeight;
      const scrollTop = this.scrollContainer.scrollTop;
      const scrollPercentage = scrollTop / maxScrollTop;
      const maxThumbTop = containerHeight - this.thumbSizeY;
      const thumbTop = scrollPercentage * maxThumbTop;
      this.thumbY.style.top = `${Math.min(Math.max(thumbTop, 0), maxThumbTop)}px`;
    }

    if (this.hasHorizontalScrollbar) {
      const maxScrollLeft = scrollWidth - containerWidth;
      const scrollLeft = this.scrollContainer.scrollLeft;
      const scrollPercentage = scrollLeft / maxScrollLeft;
      const maxThumbLeft = containerWidth - this.thumbSizeX;
      const thumbLeft = scrollPercentage * maxThumbLeft;
      this.thumbX.style.left = `${Math.min(Math.max(thumbLeft, 0), maxThumbLeft)}px`;
    }
  }

  //#endregion COMPONENT FUNCTIONS
  render() {
    return (
      <Host
        style={{
          ...this.scrollStylesYoApply,
          '--padding': this._padding,
          '--scrollSpace': '0px',
          '--scrollHeight': this.fullHeight ? '100%' : 'fit-content',
          '--thumbSizeY': TBU.tbu(TBU.px(this.thumbSizeY)),
          '--thumbSizeX': TBU.tbu(TBU.px(this.thumbSizeX)),
        }}
      >
        <div ref={refZone => (this.zoneToScroll = refZone)} class="zoneToScroll">
          <div ref={scrollContainerRef => (this.scrollContainer = scrollContainerRef)} class={{ 'scrollbar-container': true, 'disabled': this.disabled }}>
            <div class={`scrollbar-container--fake-scrollbarY ${this.visibilityClass}`} style={{ display: this.hasVerticalScrollbar ? 'flex' : 'none' }}>
              <div
                ref={thumbRefY => (this.thumbY = thumbRefY)}
                class={`scrollbar-container--fake-scrollbarY__thumb ${this.visibilityClass}`}
                onMouseDown={event => this.handleMouseDown(event, 'vertical')}
              ></div>
            </div>
            <div class={`scrollbar-container--fake-scrollbarX ${this.visibilityClass}`} style={{ display: this.hasHorizontalScrollbar ? 'flex' : 'none' }}>
              <div
                ref={thumbRefX => (this.thumbX = thumbRefX)}
                class={`scrollbar-container--fake-scrollbarX__thumb ${this.visibilityClass}`}
                onMouseDown={event => this.handleMouseDown(event, 'horizontal')}
              ></div>
            </div>
            <div ref={contentRef => (this.content = contentRef)}>
              <slot></slot>
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
