import { TBU } from '../../../models';
import { Color } from '../../../utils/misc/enums/color.enum';

export class ScrollStyleModel {
  scrollbar?: ScrollbarModel;
  thumb?: ThumbModel;
  track?: TrackModel;

  constructor(config) {
    this.scrollbar = new ScrollbarModel(config?.scrollbar);
    this.thumb = new ThumbModel(config?.thumb);
    this.track = new TrackModel(config?.track);
  }
}

export class ScrollbarModel {
  marginGap?: number;

  constructor(config) {
    this.marginGap = config?.marginGap ?? 2;
  }
}

export class ThumbModel {
  width?: number;
  color?: string;
  hoverColor?: string;
  activeColor?: string;
  borderRadius?: number;

  constructor(config) {
    this.width = config?.width ?? 6;
    this.color = config?.color ?? Color.c_scale_12;
    this.hoverColor = config?.hoverColor ?? Color.c_scale_12;
    this.activeColor = config?.activeColor ?? Color.c_scale_12;
    this.borderRadius = config?.borderRadius ?? 14;
  }
}

export class TrackModel {
  width?: number;
  color?: string;
  hoverColor?: string;
  activeColor?: string;
  borderRadius?: number;

  constructor(config) {
    this.width = config?.width ?? 8;
    this.color = config?.color ?? Color.c_scale_7;
    this.hoverColor = config?.hoverColor ?? Color.c_scale_7;
    this.activeColor = config?.activeColor ?? Color.c_scale_7;
    this.borderRadius = config?.borderRadius ?? 0;
  }
}
