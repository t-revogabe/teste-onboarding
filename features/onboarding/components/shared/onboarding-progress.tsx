import { StyleSheet, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, withTiming } from "react-native-reanimated";

import theme from "@/constants/onboarding-theme";
import { useResponsive } from "@/hooks/use-responsive";

interface OnboardingProgressProps {
  currentStep: number;
  amountOfSteps: number;
}

function OnboardingProgress({ currentStep, amountOfSteps }: OnboardingProgressProps) {
  const { tabletStyles } = useResponsive();
  const progress = Math.min(Math.max(currentStep / amountOfSteps, 0), 1);

  const tablet = tabletStyles({
    bar: { height: 18, borderRadius: 10 },
  });

  const accentStyle = useAnimatedStyle(() => ({
    flex: withTiming(progress, { duration: 300, easing: Easing.out(Easing.ease) }),
  }));

  const grayStyle = useAnimatedStyle(() => ({
    flex: withTiming(1 - progress, { duration: 300, easing: Easing.out(Easing.ease) }),
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.accentBar, tablet.bar, accentStyle]} />
      <Animated.View style={[styles.grayBar, tablet.bar, grayStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  accentBar: {
    height: 14,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
  },
  grayBar: {
    height: 14,
    backgroundColor: theme.colors.gray[200],
    borderRadius: 8,
  },
});

export default OnboardingProgress;
