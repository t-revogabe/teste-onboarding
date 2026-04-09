import { Easing, FadeInDown, FadeInUp } from "react-native-reanimated";

export const STAGGER_DELAY = 100;
export const ANIMATION_DURATION = 350;

export function staggeredFadeInDown(index: number, baseOffset = 0) {
  return FadeInDown.delay((baseOffset + index) * STAGGER_DELAY)
    .duration(ANIMATION_DURATION)
    .easing(Easing.out(Easing.ease));
}

export function staggeredFadeInUp(index: number, baseOffset = 0) {
  return FadeInUp.delay((baseOffset + index) * STAGGER_DELAY)
    .duration(ANIMATION_DURATION)
    .easing(Easing.out(Easing.ease));
}
