import { Component, Element, h, Host, Prop, State, Watch } from '@stencil/core';
import { TBU } from '../../models';

@Component({
  tag: 'np-scrollbar',
  styleUrl: 'np-scrollbar.scss',
  shadow: true,
})
export class NpScrollbar {
  //#region ELEMENTS
  @Element() hostElement: HTMLElement;
  scrollContainer;
  fakeScrollbar;
  thumb;
  content;
  //#endregion ELEMENTS

  //#region PROPS
  @Prop({ attribute: 'disabled' }) disabled: boolean = false;
  @Prop({ attribute: 'fullHeight' }) fullHeight: boolean = false;
  _padding: string = TBU.tbu(TBU.px(6));
  @Prop({ attribute: 'padding' }) padding: number = 6;
  @Watch('padding') watchPadding(newValue: number) {
    this._padding = TBU.tbu(TBU.px(newValue));
  }

  //#endregion PROPS

  //#region LOCAL VARIABLES
  isDragging: boolean = false;
  hasHorizontalScrollbar = false;
  @State() hasVerticalScrollbar = false;
  @State() thumbSize: number = 0;
  @State() mouseGap: number = 0;

  //#endregion LOCAL VARIABLES

  //#region LIFE CICLES
  componentWillLoad() {
    this.watchPadding(this.padding);
  }
  componentDidLoad() {
    this.hasVerticalScrollbar = this.scrollContainer.scrollHeight > this.hostElement.clientHeight - this.padding * 2;
    // Calculate the ratio between container height and content height
    const containerHeight = this.hostElement.clientHeight;
    const contentHeight = this.scrollContainer.scrollHeight;

    if (contentHeight > containerHeight) {
      const ratio = containerHeight / contentHeight;

      // Calculate the thumb size as a percentage of the container height
      this.thumbSize = Math.max(ratio * containerHeight, 20); // Set a minimum size for the thumb

      // Add scroll event listener to update thumb position when scrolling
      // this.scrollContainer.addEventListener('scroll', () => this.updateThumbPosition());
    } else {
      // If no scrollbar is needed, reset thumbSize
      this.thumbSize = 0;
    }
    document.addEventListener('mousemove', event => this.handleMouseMove(event));
    document.addEventListener('mouseup', () => {
      this.isDragging = false;
      this.mouseGap = 0;
    });
  }
  //#endregion LIFE CICLES

  //#region COMPONENT FUNCTIONS

  handleMouseDown(event) {
    this.isDragging = true;
    const containerBounds = this.hostElement.getBoundingClientRect();
    const thumbBounds = this.thumb.getBoundingClientRect();
    console.log('%cnc-devkitsrccomponents\np-scrollbar\np-scrollbar.tsx:74 thumbBounds.top', 'color: #007acc;', thumbBounds.top);
    this.mouseGap = event.clientY - thumbBounds.top;
  }

  handleMouseMove(event) {
    const containerBounds = this.hostElement.getBoundingClientRect();
    const thumbBounds = this.thumb.getBoundingClientRect();
    if (this.isDragging) {
      // Calculate the Y position of the thumb within the container
      // const clampedY = Math.max(0, Math.min(event.clientY - containerBounds.top - this.thumbSize / 2, containerBounds.height - this.thumbSize));
      console.log('%cnc-devkitsrccomponents\np-scrollbar\np-scrollbar.tsx:83 event.clientY', 'color: #007acc;', event.clientY);
      console.log('%cnc-devkitsrccomponents\np-scrollbar\np-scrollbar.tsx:84 this.mouseGap', 'color: #007acc;', this.mouseGap);
      const clampedY = event.clientY - this.mouseGap;
      this.thumb.style.top = `${clampedY}px`;

      // Calculate the scroll percentage relative to the thumb's position
      const scrollPercentage = clampedY / (containerBounds.height - this.thumbSize);

      // Calculate the final scroll position in the content
      const maxScrollTop = this.scrollContainer.scrollHeight - containerBounds.height;
      let scrollPosition = scrollPercentage * maxScrollTop;

      // Scroll the content based on the calculated position
      this.scrollContainer.scrollTo({
        top: scrollPosition,
        behavior: 'auto', // Use 'auto' for instant scrolling
      });
    }
  }

  updateThumbPosition() {
    const containerHeight = this.hostElement.clientHeight;
    const maxScrollTop = this.scrollContainer.scrollHeight - containerHeight;

    // Calculate the thumb's new position based on the scroll position
    const scrollTop = this.scrollContainer.scrollTop;
    const scrollPercentage = scrollTop / maxScrollTop;
    const thumbTop = scrollPercentage * (containerHeight - this.thumbSize);

    // Update the thumb's position
    this.fakeScrollbar.style.top = `${thumbTop}px`;
  }

  //#endregion COMPONENT FUNCTIONS
  render() {
    return (
      <Host style={{ '--padding': this._padding, '--scrollHeight': this.fullHeight ? '100%' : 'fit-content', '--thumbSize': TBU.tbu(TBU.px(this.thumbSize)) }}>
        <div ref={scrollContainerRef => (this.scrollContainer = scrollContainerRef)} class={{ 'scrollbar-container': true, 'disabled': this.disabled }}>
          <div ref={ref => (this.fakeScrollbar = ref)} class="scrollbar-container--fake-scrollbar" style={{ display: this.hasVerticalScrollbar ? 'block' : 'none' }}>
            <div ref={ref => (this.thumb = ref)} class="scrollbar-container--fake-scrollbar__thumb" onMouseDown={event => this.handleMouseDown(event)}></div>
          </div>
          <div ref={contentRef => (this.content = contentRef)}>
            <slot></slot>
          </div>
        </div>
      </Host>
    );
  }
}
