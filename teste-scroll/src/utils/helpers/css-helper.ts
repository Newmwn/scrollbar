export class CssHelper {
  constructor() {}

  static generateCss(style) {
    document.querySelectorAll('style').forEach(elem => {
      if (elem.getAttribute('id') === style.selector) elem.parentNode.removeChild(style);
    });

    let css = document.createElement('style');
    css.setAttribute('id', style.selector);
    css.setAttribute('type', 'text/css');
    let styles = '';
    let defaultStyle = {};
    let hoverStyle = {};

    function generateMedia(minWidth, maxWidth) {
      if (minWidth != null && maxWidth != null) {
        return `@media (min-width:${minWidth}px) and (max-width:${maxWidth}px)`;
      }
      if (minWidth != null) {
        return `@media (min-width:${minWidth}px)`;
      }

      if (maxWidth != null) {
        return `@media (max-width:${maxWidth}px)`;
      }

      return null;
    }

    function replaceAll(value, splitValue, joinValue) {
      value.split(splitValue).join(joinValue);
    }

    function prepareCss(value) {
      let form: any = JSON.stringify(value);
      form = replaceAll(form, ',', '!important;');
      form = Object.keys(value).length > 0 ? form.replace('}', '!important; }') : form;
      form = replaceAll(form, '"', '');

      return form;
    }

    style.breakpoints.map(elem => {
      const media = generateMedia(elem?.minWidth, elem?.maxWidth);

      defaultStyle = { ...defaultStyle, ...(elem?.styles?.default ?? {}) };
      let def: any = prepareCss(defaultStyle);

      hoverStyle = { ...hoverStyle, ...(elem?.styles?.hover ?? {}) };
      let hover: any = prepareCss(hoverStyle);

      let selectorInitial = `${style.selector} ${def}`;
      let selectorHover = `${style.selector}:hover ${hover}`;
      styles = media ? `${styles} ${media} { ${selectorInitial} ${selectorHover}}` : `${styles} ${selectorInitial} ${selectorHover}`;
    });

    if ((css as any).styleSheet) (css as any).styleSheet.cssText = styles;
    else css.appendChild(document.createTextNode(styles));

    return css;
  }
}
