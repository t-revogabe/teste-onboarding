import { useWindowDimensions } from "react-native";

const BASE_WIDTH = 393;
const TABLET_BREAKPOINT = 768;
const SCALE_RATE = 0.35;
const FONT_SCALE_RATE = 0.25;
const FONT_SCALE_CAP = 1.3;

export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const tablet = width >= TABLET_BREAKPOINT;

  function scaledSize(base: number, opts?: { min?: number; max?: number }): number {
    const scale = 1 + (width / BASE_WIDTH - 1) * SCALE_RATE;
    const result = base * scale;
    if (opts?.min !== undefined && result < opts.min) return opts.min;
    if (opts?.max !== undefined && result > opts.max) return opts.max;
    return Math.round(result);
  }

  function responsiveFontSize(basePt: number): number {
    const scale = Math.min(1 + (width / BASE_WIDTH - 1) * FONT_SCALE_RATE, FONT_SCALE_CAP);
    return Math.round(basePt * scale);
  }

  function tabletStyles<T extends Record<string, any>>(styles: T): T {
    if (!tablet) {
      const empty = {} as Record<string, any>;
      for (const key of Object.keys(styles)) {
        empty[key] = {};
      }
      return empty as T;
    }
    return styles;
  }

  return {
    width,
    height,
    isTablet: tablet,
    gridColumns: tablet ? 3 : 2,
    scaledSize,
    responsiveFontSize,
    tabletStyles,
  };
}
