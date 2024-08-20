export class ColorsHelper {
  static rgbToDecimal(color) {
    let r = parseInt(color.r);
    let g = parseInt(color.g);
    let b = parseInt(color.b);
    return (r << 16) + (g << 8) + b;
  }

  static decimalToRgb(color) {
    let r = Math.floor(color / (256 * 256));
    let g = Math.floor(color / 256) % 256;
    let b = color % 256;
    return { r: r, g: g, b: b };
  }

  static decimalToRgba(color, opacity) {
    let r = Math.floor(color / (256 * 256));
    let g = Math.floor(color / 256) % 256;
    let b = color % 256;
    return { r: r, g: g, b: b, a: opacity };
  }

  static hexaToDecimal(color) {
    return parseInt(color, 16);
  }

  static decimalToHexa(color) {
    let hexaValue = Number(color).toString(16);
    return `#${'0'.repeat(Math.max(6 - hexaValue.length, 0))}${hexaValue}`;
  }

  static hexToRGBA(hex) {
    let alpha = false,
      h = hex.slice(hex.startsWith('#') ? 1 : 0);
    if (h.length === 3) h = [...h].map((x) => x + x).join('');
    else if (h.length === 8) alpha = true;
    h = parseInt(h, 16);
    return {
      r: h >>> (alpha ? 24 : 16),
      g: (h & (alpha ? 0x00ff0000 : 0x00ff00)) >>> (alpha ? 16 : 8),
      b: (h & (alpha ? 0x0000ff00 : 0x0000ff)) >>> (alpha ? 8 : 0),
      a: alpha ? 1 - (h & 0x000000ff) / 255 : 1,
    };
  }

  static colorCodeOpacityToHexa(colorCode: number, opacity: number) {
    const componentToHex = (c) => {
      let hex = c.toString(16);
      return hex.length == 1 ? '0' + hex : hex;
    };

    const opacityToHex = (a) => {
      let hexaOpacity = (a * 255).toString(16).split('.');

      return hexaOpacity.length > 0
        ? hexaOpacity[0].length === 1
          ? hexaOpacity[0] + '0'
          : hexaOpacity[0]
        : '00';
    };

    const rgbToHex = (r, g, b, a) => {
      return (
        '#' +
        componentToHex(r) +
        componentToHex(g) +
        componentToHex(b) +
        opacityToHex(a)
      );
    };

    let currentColor = {
      ...ColorsHelper.decimalToRgb(colorCode ?? 0),
    };

    return rgbToHex(
      currentColor.r,
      currentColor.g,
      currentColor.b,
      opacity ?? 0
    );
  }

  static convertColorCodeOpacityToRgb(colorCode: number, opacity: number) {
    let bgColor = '';
    if (colorCode) {
      let temp = ColorsHelper.decimalToRgba(colorCode, opacity);
      bgColor = `rgba(${temp.r},${temp.g},${temp.b},${temp.a})`;
    }
    return bgColor;
  }
}
