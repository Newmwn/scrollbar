/** Manifest Model */
export class ThemeManifest {
  public propertyName: string;
  public propertyValue: string;

  constructor(propertyName: string, propertyValue: string) {
    this.propertyName = propertyName;
    this.propertyValue = propertyValue;
  }
}

export class ThemeHelper {
  /** Convert manifest to style variables*/
  static manifestToStyleVariables(manifest: Array<ThemeManifest>, elementHtml?) {
    //Element Html
    if (elementHtml) {
      let css = '';
      manifest.forEach(element => {
        let colorRgb = this.variablesToRgb(element.propertyValue);

        if (colorRgb) {
          let propertyRgb = `--${element.propertyName}_rgb: ${colorRgb}; `;
          css = css.concat(propertyRgb);
        }

        let property = `--${element.propertyName}: ${element.propertyValue}; `;
        css = css.concat(property);
      });

      elementHtml.setAttribute('style', css);
    } else {
      // Root
      manifest.forEach(element => {
        let colorRgb = this.variablesToRgb(element.propertyValue);

        const root = document.documentElement;
        if (colorRgb) root.style.setProperty(`--${element.propertyName}_rgb`, `${colorRgb}`);
        root.style.setProperty(`--${element.propertyName}`, `${element.propertyValue}`);
      });
    }
  }

  /** Convert variable to rgb*/
  static variablesToRgb(colorHexadecimal) {
    let h = colorHexadecimal;
    if (h.includes('#')) {
      let r, g, b;
      r = parseInt('0x' + h[1] + h[2]);
      g = parseInt('0x' + h[3] + h[4]);
      b = parseInt('0x' + h[5] + h[6]);
      let colorRgb = `${r},${g},${b}`;

      return colorRgb;
    }
  }
}
