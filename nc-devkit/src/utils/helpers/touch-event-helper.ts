/**
 * new TouchEventHelper(ref, xDiff, yDiff)
 * Allows to pass an element reference or listen to the window of the page
 * Allows also to define a horizontal difference to detect a swipe right or left and a vertical difference to detect a swipe up or down.
 * @param ref : Element Ref
 * @param xDiff : Horizontal Difference : number
 * @param yDiff : Vertical Difference : number
 */
export class TouchEventHelper {
  private elementRef: any;
  private callback: any;
  private touchXLocation: any = null;
  private touchYLocation: any = null;
  private xDiff: number = 0;
  private yDiff: number = 0;
  private preventMobileRefresh: boolean = false;
  private preventDefault: boolean = false;

  /**
   * Constructs the TouchEventHelper class that will listen to touch events.
   * Allows to pass an element reference or listen to the window of the page
   * Allows also to define a horizontal difference to detect a swipe right or left and a vertical difference to detect a swipe up or down.
   * @param ref : Element Ref
   * @param xDiff : Horizontal Difference
   * @param yDiff : Vertical Difference
   */
  constructor(ref?: any, xDiff?: number, yDiff?: number, preventMobileRefresh?: boolean, preventDefault?: boolean) {
    this.elementRef = ref ?? window;
    this.xDiff = xDiff ?? 60;
    this.yDiff = yDiff ?? 60;
    this.preventMobileRefresh = preventMobileRefresh ?? false;
    this.preventDefault = preventDefault ?? false;
  }

  /**
   * Detects start of TouchEvent
   * @param e : TouchEvent
   */
  private onTouchStart = (e: TouchEvent) => {
    this.touchXLocation = e.touches[0].clientX;
    this.touchYLocation = e.touches[0].clientY;
  };

  /**
   * Detects when the touch is beign moved
   * @param e : TouchEvent
   */
  private onTouchMove = (e: TouchEvent) => {
    if (this.preventDefault || (this.preventMobileRefresh && (window.scrollY <= 0 || window.innerHeight + window.scrollY >= document.body.offsetHeight))) {
      e.preventDefault();
    }
    let diffX = this.touchXLocation - e.touches[0].clientX;
    let diffY = this.touchYLocation - e.touches[0].clientY;

    if (diffX > this.xDiff) {
      this.callback('right');
      this.touchXLocation = e.touches[0].clientX;
    } else if (diffX < -this.xDiff) {
      this.callback('left');
      this.touchXLocation = e.touches[0].clientX;
    }

    if (diffY > this.yDiff) {
      this.callback('bottom');
      this.touchYLocation = e.touches[0].clientY;
    } else if (diffY < -this.yDiff) {
      this.callback('top');
      this.touchYLocation = e.touches[0].clientY;
    }
  };

  /**
   * Detects end of TouchEvent
   */
  private onTouchEnd = () => {
    this.touchXLocation = null;
    this.touchYLocation = null;
  };

  /**
   * Changes value of the difference to detect a move horizontally
   * @param value : number
   */
  changeXDiff = (value: number) => {
    this.xDiff = value;
  };

  /**
   * Changes value of the difference to detect a move vertically
   * @param value : number
   */
  changeYDiff = (value: number) => {
    this.yDiff = value;
  };

  /**
   * Changes if the touch event should prevent default events
   * @param value : boolean
   */
  changePreventDefault = (value: boolean) => {
    this.preventDefault = value;
  };

  /**
   * Initializes Touch Listeners
   * @param callback : Function
   */
  initListener = (callback: Function) => {
    this.callback = callback;
    this.elementRef.addEventListener('touchstart', this.onTouchStart, {
      passive: false,
    });

    this.elementRef.addEventListener('touchmove', this.onTouchMove, {
      passive: false,
    });

    this.elementRef.addEventListener('touchend', this.onTouchEnd, {
      passive: false,
    });

    this.elementRef.addEventListener('touchcancel', this.onTouchEnd, {
      passive: false,
    });
  };

  /**
   * Destroys Touch Listeners
   */
  destroyListener = () => {
    this.elementRef.removeEventListener('touchstart', this.onTouchStart, {
      passive: false,
    });

    this.elementRef.removeEventListener('touchmove', this.onTouchMove, {
      passive: false,
    });

    this.elementRef.removeEventListener('touchend', this.onTouchEnd, {
      passive: false,
    });

    this.elementRef.removeEventListener('touchcancel', this.onTouchEnd, {
      passive: false,
    });
  };
}
