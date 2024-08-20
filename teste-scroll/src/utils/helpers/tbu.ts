export class TBU {
  static style = getComputedStyle(document.body);
  static sizeType = TBU.style.getPropertyValue('--sizetype').trim();

  constructor() {}

  static init(value: number) {
    document.documentElement.style.setProperty('--app-zoom', `${value}`);
  }

  static useZoom(element: HTMLElement, percentage: number = 100, apply: boolean = true) {
    const zoomLevel = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--app-zoom'));
    element.style.setProperty('--app-zoom', apply ? `${(100 + (zoomLevel * 100 - 100) * (percentage / 100)) / 100}` : '1');
  }

  static getZoom(percentage: number = 100) {
    const zoomLevel = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--app-zoom'));

    return `${(100 + (zoomLevel * 100 - 100) * (percentage / 100)) / 100}`;
  }

  static getSizeType() {
    TBU.style = getComputedStyle(document.body);
    TBU.sizeType = TBU.style.getPropertyValue('--sizetype').trim();
  }

  static tbu(size, applyZoom = 0) {
    TBU.getSizeType();

    if (TBU.sizeType === 'tbu') {
      return TBU.calcSize(size, applyZoom);
    } else if (TBU.sizeType === 'rem') {
      return Number(size) + 'rem';
    } else {
      return Number(size) + 'px';
    }
  }

  /**
   * @deprecated
   */
  static setFontSize(size, applyZoom = 0) {
    TBU.getSizeType();

    if (TBU.sizeType === 'tbu') {
      return TBU.calcSize(size, applyZoom);
    } else if (TBU.sizeType === 'rem') {
      return Number(size) + 'rem';
    } else {
      return Number(size) + 'px';
    }
  }

  static px(size) {
    TBU.getSizeType();

    if (TBU.sizeType === 'tbu') {
      return (size * 100) / 1040;
    } else if (TBU.sizeType === 'rem') {
      return TBU.pxToRem(size);
    } else {
      return size;
    }
  }

  static calcSize(size, applyZoom = 0) {
    TBU.getSizeType();

    if (applyZoom == 0) {
      return `calc(calc(((${size}) / 100) * var(--screenHeight)) * 1)`;
    } else {
      return `calc(calc(((${size}) / 100) * var(--screenHeight)) * var(--app-zoom))`;
    }
  }

  static pxToRem(size) {
    TBU.getSizeType();

    return size / 16;
  }

  static pxTopt(size) {
    TBU.getSizeType();

    return (size * 1.3333 * 100) / 1040;
  }

  static screenHeight() {
    const height = Math.min(window.screen.height, window.screen.width);
    return document.documentElement.style.setProperty('--screenHeight', height + 'px');
  }

  static getScreenHeight() {
    window.addEventListener('resize', () => {
      return TBU.screenHeight();
    });
    return TBU.screenHeight();
  }
}

TBU.getScreenHeight();
