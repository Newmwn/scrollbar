import { DeviceOptions, DevicesEnum } from './models/responsive.model';

export class ResponsiveHelpers {
  /**
   * Retrieves if the current device OS is Android, Apple(IOS, IpadOS) or Other
   * @returns : DeviceOptions
   */
  static getCurrentDevice = (): DeviceOptions | void => {
    if ((window as any)?.instances) {
      const userAgent = navigator.userAgent;
      if (userAgent.match(/Android/i)) return DevicesEnum.Android;
      else if (userAgent.match(/iPhone|iPad|iPod/i)) return DevicesEnum.IOS;
      else return DevicesEnum.Other;
    }
  };
}
