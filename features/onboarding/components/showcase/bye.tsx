import { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { Easing, FadeIn } from "react-native-reanimated";

import Text from "@/components/text";
import theme from "@/constants/onboarding-theme";
import { useResponsive } from "@/hooks/use-responsive";
import { useOnboardingFooter } from "../../contexts/onboarding-layout-context";
import { useOnboardingNavigation } from "../../hooks/use-onboarding-navigation";

const ENTERING = FadeIn.duration(400).easing(Easing.out(Easing.ease));

function Bye() {
  const { responsiveFontSize, tabletStyles } = useResponsive();
  const { goToNextStep } = useOnboardingNavigation("welcome");

  const handleContinue = useCallback(() => {
    goToNextStep();
  }, [goToNextStep]);

  useOnboardingFooter({
    onContinue: handleContinue,
    disabled: false,
    loading: null,
    removeSkipButton: true,
    continueText: "Get Started",
  });

  const tablet = tabletStyles({
    title: { fontSize: responsiveFontSize(32) },
    subtitle: { fontSize: responsiveFontSize(16) },
    emoji: { fontSize: responsiveFontSize(80) },
  });

  return (
    <View style={styles.container}>
      <Animated.View entering={ENTERING} style={styles.content}>
        <Text style={[styles.emoji, tablet.emoji]}>👋</Text>

        <Text variant="bold" style={[styles.title, tablet.title]}>
          Bye
        </Text>

        <Text variant="regular" style={[styles.subtitle, tablet.subtitle]}>
          Let's personalize your experience in just a few steps.
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 32,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    color: theme.colors.brown[500],
    textAlign: "center",
    letterSpacing: -0.64,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.black.opacity[50],
    textAlign: "center",
    lineHeight: 24,
  },
});

export default Bye;
