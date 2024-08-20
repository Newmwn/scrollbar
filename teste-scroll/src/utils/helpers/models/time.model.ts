export type timeOptions = "ms" | "s" | "m" | "h" | "d";

export type roundedOptions = null | false | number | true;

export interface converterResponse {
  milliseconds: number;
  seconds: number;
  minutes: number;
  hours: number;
  days: number;
}
