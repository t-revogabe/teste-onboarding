import { usePathname } from "expo-router";
import { useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { Easing, FadeIn } from "react-native-reanimated";

import { ArrowLeft } from "lucide-react-native";

import IconButton from "@/components/icon-button";
import Text from "@/components/text";
import theme from "@/constants/onboarding-theme";
import { getStepIdFromRoute } from "../../constants/onboarding-routes";
import { REMOVE_PADDING_FROM_ONBOARDING_STEPS } from "../../constants/onboarding-steps";
import { useOnboardingNavigation } from "../../hooks/use-onboarding-navigation";
import { useOnboardingStore } from "../../stores/onboarding-store";
import { getStepsForFlow } from "../../utils/onboarding-flow";
import { useResponsive } from "@/hooks/use-responsive";

import OnboardingProgress from "./onboarding-progress";

const TITLE_ENTERING = FadeIn.duration(350).delay(50).easing(Easing.out(Easing.ease));
const SUBTLE_ENTERING = FadeIn.duration(350).delay(100).easing(Easing.out(Easing.ease));

function OnboardingHeader() {
  const pathname = usePathname();
  const { data } = useOnboardingStore();
  const { responsiveFontSize, isTablet, tabletStyles } = useResponsive();

  const stepId = useMemo(() => {
    const segment = pathname.split("/").pop() ?? "";
    return getStepIdFromRoute(segment);
  }, [pathname]);

  const steps = useMemo(() => getStepsForFlow(data.answers), [data.answers]);

  const { goToPreviousStep } = useOnboardingNavigation(stepId ?? "");

  const handlePreviousStep = useCallback(() => {
    goToPreviousStep();
  }, [goToPreviousStep]);

  const tablet = tabletStyles({
    header: { height: 48, gap: 14 },
    backButton: { width: 40, height: 40, borderRadius: 14 },
    titleContainer: { paddingVertical: 56, gap: 12 },
    title: { fontSize: responsiveFontSize(24), lineHeight: responsiveFontSize(30) },
    subtle: { fontSize: responsiveFontSize(14) },
  });

  if (!stepId) {
    return null;
  }

  const shouldAddHeaderPadding = REMOVE_PADDING_FROM_ONBOARDING_STEPS.includes(stepId);
  const currentStep = steps.find((step) => step.id === stepId);
  const isFirstStep = steps.length > 0 && stepId === steps[0].id;
  const currentStepIndex = steps.findIndex((step) => step.id === stepId);
  const hasTitle = currentStep?.title && currentStep.title.trim();

  return (
    <View style={[shouldAddHeaderPadding && styles.paddingContainer]}>
      <View style={[styles.header, tablet.header]}>
        {!isFirstStep && (
          <IconButton variant="secondary" style={[styles.backButton, tablet.backButton]} onPress={handlePreviousStep}>
            <ArrowLeft size={isTablet ? 20 : 16} color={theme.colors.black[0]} />
          </IconButton>
        )}

        <OnboardingProgress currentStep={currentStepIndex + 1} amountOfSteps={steps.length} />
      </View>

      {hasTitle && (
        <View key={stepId} style={[styles.titleContainer, tablet.titleContainer]}>
          <Animated.View entering={TITLE_ENTERING}>
            <Text variant="semibold" style={[styles.title, tablet.title]}>
              {currentStep.title}
            </Text>
          </Animated.View>

          {currentStep.subtitle && (
            <Animated.View entering={SUBTLE_ENTERING}>
              <Text variant="regular" style={[styles.subtle, tablet.subtle]}>
                {currentStep.subtitle}
              </Text>
            </Animated.View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  paddingContainer: {
    paddingHorizontal: theme.padding.horizontal,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 38,
    gap: 10,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: theme.colors.gray[200],
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    alignItems: "center",
    paddingVertical: 44,
    gap: 8,
  },
  title: {
    fontSize: 24,
    color: theme.colors.brown[500],
    textAlign: "center",
    letterSpacing: -0.48,
    lineHeight: 30,
  },
  subtle: {
    fontSize: 14,
    color: theme.colors.black.opacity[60],
    textAlign: "center",
    letterSpacing: -0.28,
  },
});

export default OnboardingHeader;
