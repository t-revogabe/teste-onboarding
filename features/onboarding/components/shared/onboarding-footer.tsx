import { useCallback } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  Easing,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import Button from "@/components/button";
import { useOnboardingLayout } from "../../contexts/onboarding-layout-context";
import { useResponsive } from "@/hooks/use-responsive";

const SCALE_DOWN = { duration: 80, easing: Easing.inOut(Easing.ease) };
const SCALE_UP = { duration: 200, easing: Easing.out(Easing.ease) };
const FOOTER_ENTERING = FadeInUp.duration(350).delay(200).easing(Easing.out(Easing.ease));

function OnboardingFooter() {
  const { footerConfig, continueRef } = useOnboardingLayout();
  const { tabletStyles, responsiveFontSize } = useResponsive();

  const tablet = tabletStyles({
    button: { height: 56 },
    continueText: { fontSize: responsiveFontSize(16) },
    skipText: { fontSize: responsiveFontSize(14) },
  });

  const continueScale = useSharedValue(1);
  const skipScale = useSharedValue(1);

  const continueAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: continueScale.value }],
  }));

  const skipAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: skipScale.value }],
  }));

  const handleContinue = useCallback(
    (skip?: boolean) => {
      const targetScale = skip ? skipScale : continueScale;
      targetScale.value = withSequence(withTiming(0.96, SCALE_DOWN), withTiming(1, SCALE_UP));
      continueRef.current?.(skip);
    },
    [continueRef, continueScale, skipScale]
  );

  const {
    disabled,
    loading,
    skipText = "Skip",
    continueText = "Continue",
    removeSkipButton = false,
    hideFooter = false,
  } = footerConfig;

  if (hideFooter) {
    return null;
  }

  return (
    <Animated.View entering={FOOTER_ENTERING} style={styles.buttonsContainer}>
      <Animated.View style={continueAnimatedStyle}>
        <Button
          onPress={() => handleContinue(false)}
          disabled={disabled || loading === "skipping"}
          isLoading={loading === "submitting"}
          style={[styles.continueButton, tablet.button]}
          textStyle={tablet.continueText}
          textProps={{ variant: "regular" }}
        >
          {continueText}
        </Button>
      </Animated.View>

      {!removeSkipButton && (
        <Animated.View style={skipAnimatedStyle}>
          <Button
            onPress={() => handleContinue(true)}
            variant="terciary"
            disabled={loading === "submitting"}
            isLoading={loading === "skipping"}
            style={[styles.skipButton, tablet.button]}
            textStyle={tablet.skipText}
          >
            {skipText}
          </Button>
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  buttonsContainer: {
    gap: 10,
  },
  continueButton: {
    borderRadius: 100,
    height: 48,
  },
  skipButton: {
    borderRadius: 100,
    height: 48,
  },
});

export default OnboardingFooter;
