//#region models

import { ThemeHelper, ThemeManifest } from '../models';
import { GlobalStoreHelper } from './helpers/global-store-helper';

export enum UnitTypeEnum {
  Tbu = 'tbu',
  Rem = 'rem',
  Px = 'px',
}

export enum DevkitStyleEnum {
  Desktop = 'desktop',
  Mobile = 'mobile',
  Web = 'web',
}

export interface DevKitSetConfig {
  defaultImagePath: string;
  imagePath: string;
  unitType: UnitTypeEnum;
  zoom?: number;
  theme?: ThemeManifest[];
  style?: DevkitStyleEnum;
}

export interface DevKitValues {
  defaultImagePath: string;
  imagePath: string;
  unitType: UnitTypeEnum;
  zoom: number;
  style: DevkitStyleEnum;
}

//#endregion models

/**
 *
 * This method use to config when initialize applications
 *  - defaultImagePath: default image path assets
 *  - imagePath: image path assets
 *  - unitType: unity type used on app in all components
 *  - theme: Application theme from api
 *  - zoom: zoom apply in all components, but only use if use unit type TBU
 *  - style: default style to apply in all components
 *
 * @example use case:
 * Devkit.init({
 *   defaultImagePath: `${environment.config.pathResources}/lib_assets/`,
 *   imagePath: `${environment.config.pathResources}/lib_assets/`,
 *   unitType: UnitTypeEnum.Tbu
 *   zoom: 2,
 *   style: DevkitStyleEnum.Desktop
 * });
 */
export class Devkit {
  /**
   * Retrieves the DevKit configuration values from the global store.
   * @returns DevKitValues object.
   */
  public static getValues = (): DevKitValues => {
    return GlobalStoreHelper.GetSharedData<DevKitValues>('devkit');
  };

  /**
   * Initializes the Devkit configuration.
   * @param obj - The DevKitSetConfig object containing the configuration values.
   * @param secret - The secret key used for authentication.
   * @param nonEncryptedKeys - The keys that should not be encrypted.
   */
  public static init(obj: DevKitSetConfig, secret: string, nonEncryptedKeys: string[] = []) {
    // Set default values for the configuration properties
    const devkitConfig = {
      defaultImagePath: obj.defaultImagePath ?? '/assets/images/',
      imagePath: obj.imagePath ?? '/assets/images/',
      unitType: obj.unitType ?? UnitTypeEnum.Tbu,
      zoom: ![UnitTypeEnum.Px, UnitTypeEnum.Rem].includes(obj.unitType) && obj?.zoom ? obj?.zoom : 1,
      theme: obj?.theme ?? null,
      style: obj?.style ?? DevkitStyleEnum.Desktop,
    };

    // Initiates the global store and excludes devkit param from encryption
    GlobalStoreHelper.init(secret, nonEncryptedKeys);
    // Set the Devkit configuration in the global store
    GlobalStoreHelper.WriteSharedData('devkit', devkitConfig);

    setTimeout(() => {
      // Set the screen height variable
      this.setScreenHeightVariable();
      // Set the unit type variable
      this.setUnitTypeVariable(devkitConfig.unitType);
      // Set the theme variables
      this.setThemeVariables(devkitConfig?.theme ?? null);
      // Set the zoom variable if using TBU unit type
      if (devkitConfig.unitType === UnitTypeEnum.Tbu) this.setZoomVariable(devkitConfig.zoom);
    });
  }

  //set width and height screen
  public static setScreenHeightVariable() {
    const height = Math.min(window.screen.availHeight, window.screen.availWidth);
    document.documentElement.style.setProperty('--screenHeight', `${height}px`);

    window.addEventListener('resize', () => {
      const height = Math.min(window.screen.availHeight, window.screen.availWidth);
      document.documentElement.style.setProperty('--screenHeight', `${height}px`);
    });
  }

  //set unit type variable use in components
  public static setUnitTypeVariable(unitType: UnitTypeEnum) {
    document.documentElement.style.setProperty('--sizetype', unitType);
  }

  //set theme if exist else set default devkit theme
  public static setThemeVariables(theme: ThemeManifest[]) {
    if (theme != null && theme?.length > 0) {
      ThemeHelper.manifestToStyleVariables(theme);
    } else {
      let styleSheets = Array.from(document.styleSheets);
      let ColorRules = styleSheets.find(sheet => (sheet.href ? sheet.href.includes('variables') : false))?.cssRules;

      if (ColorRules?.length > 0) {
        let Color = (ColorRules[0] as any).style;

        const root = document.documentElement;
        for (let i = 0; i < Color.length; i++) {
          let name = Color.item(i);
          if (!name.includes('_rgb')) {
            let hexoColor = Color.getPropertyValue(name).trim();
            let colorRgb = ThemeHelper.variablesToRgb(hexoColor);
            if (colorRgb) root.style.setProperty(`${name}_rgb`, `${colorRgb}`);
          }
        }
      }
    }
  }

  //set zoom if use unit type TBU
  public static setZoomVariable(zoom: number) {
    document.documentElement.style.setProperty('--app-zoom', `${zoom}`);
  }
}
