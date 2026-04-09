import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

import Text from "@/components/text";
import theme from "@/constants/onboarding-theme";
import { useResponsive } from "@/hooks/use-responsive";
import { useOnboardingFooter } from "../../contexts/onboarding-layout-context";
import { useOnboardingNavigation } from "../../hooks/use-onboarding-navigation";
import { useUpdateOnboarding } from "../../hooks/use-update-onboarding";
import { useOnboardingStore } from "../../stores/onboarding-store";
import { OnboardingLoadingState } from "../../types/onboarding-loading";
import type {
  MultiSelectInput,
  QuestionStepDefinition,
  SelectOption,
  SingleSelectInput,
  SliderInput,
} from "../../types/onboarding-schema";
import { staggeredFadeInDown } from "../../utils/onboarding-animations";
import { getStepById, isQuestionStep } from "../../utils/parse-onboarding";

import ContentCard from "../ui/content-card";
import MultiSelectInputComponent from "./multi-select-input";
import SingleSelectInputComponent from "./single-select-input";
import SliderInputComponent from "./slider-input";

interface QuestionRendererProps {
  stepId: string;
}

function QuestionRenderer({ stepId }: QuestionRendererProps) {
  const { responsiveFontSize, tabletStyles } = useResponsive();
  const { setAnswer, data } = useOnboardingStore();
  const { goToNextStep } = useOnboardingNavigation(stepId);
  const { mutateAsync: updateOnboarding } = useUpdateOnboarding();

  const [loading, setLoading] = useState<OnboardingLoadingState>(null);

  const step = useMemo(() => {
    const found = getStepById(stepId);
    if (!found || !isQuestionStep(found)) {
      throw new Error(`Step "${stepId}" is not a valid question step`);
    }
    return found as QuestionStepDefinition;
  }, [stepId]);

  const answer = useMemo(() => data.answers[stepId] ?? null, [data.answers, stepId]);

  const isSingleSelect = step.question.type === "single-select";
  const isMultiSelect = step.question.type === "multi-select";
  const isSlider = step.question.type === "slider";

  const selectedId = useMemo(() => {
    if (isSingleSelect && typeof answer === "string") return answer;
    return null;
  }, [isSingleSelect, answer]);

  const selectedIds = useMemo(() => {
    if (isMultiSelect && Array.isArray(answer)) return answer as string[];
    return [];
  }, [isMultiSelect, answer]);

  const sliderValue = useMemo(() => {
    if (isSlider && typeof answer === "number") return answer;
    if (isSlider && step.question.type === "slider") return step.question.default;
    return 0;
  }, [isSlider, answer, step.question]);

  const selectedOption = useMemo(() => {
    if (!isSingleSelect || !selectedId) return null;
    if (step.question.type !== "single-select") return null;
    return step.question.options.find((o: SelectOption) => o.id === selectedId) ?? null;
  }, [isSingleSelect, selectedId, step.question]);

  const disabled = useMemo(() => {
    if (isSingleSelect) return !selectedId;
    if (isMultiSelect) return selectedIds.length === 0;
    return false;
  }, [isSingleSelect, isMultiSelect, selectedId, selectedIds]);

  const handleOptionPress = useCallback(
    (optionId: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      if (isSingleSelect) {
        setAnswer(stepId, optionId);
      }

      if (isMultiSelect) {
        const isAlreadySelected = selectedIds.includes(optionId);
        const updatedIds = isAlreadySelected ? selectedIds.filter((id) => id !== optionId) : [...selectedIds, optionId];
        setAnswer(stepId, updatedIds.length > 0 ? updatedIds : null);
      }
    },
    [isSingleSelect, isMultiSelect, selectedIds, setAnswer, stepId]
  );

  const handleSliderValueChange = useCallback(
    (newValue: number) => {
      setAnswer(stepId, newValue);
    },
    [setAnswer, stepId]
  );

  const handleContinue = useCallback(
    async (skip?: boolean) => {
      try {
        setLoading(skip ? "skipping" : "submitting");

        await updateOnboarding({
          onboarding_steps: { [stepId]: data.answers[stepId] },
        });

        goToNextStep({ skipTracking: skip });
      } catch (error) {
        console.error("Failed to save answer:", error);
      } finally {
        setLoading(null);
      }
    },
    [updateOnboarding, stepId, data.answers, goToNextStep]
  );

  useEffect(() => {
    if (isSlider && data.answers[stepId] === undefined) {
      if (step.question.type === "slider") {
        setAnswer(stepId, step.question.default);
      }
    }
  }, [isSlider, data.answers, stepId, setAnswer, step.question]);

  useOnboardingFooter({
    onContinue: handleContinue,
    disabled,
    loading,
    removeSkipButton: !step.skippable,
  });

  const tablet = tabletStyles({
    feedbackText: { fontSize: responsiveFontSize(13) },
  });

  const containerStyle = isSlider ? styles.sliderContent : styles.content;

  return (
    <View style={containerStyle}>
      {step.content && (
        <Animated.View entering={staggeredFadeInDown(0)}>
          <ContentCard content={step.content} />
        </Animated.View>
      )}

      {isSingleSelect && (
        <Animated.View entering={staggeredFadeInDown(step.content ? 1 : 0)}>
          <SingleSelectInputComponent
            options={(step.question as SingleSelectInput).options}
            selectedId={selectedId}
            onSelect={handleOptionPress}
          />
        </Animated.View>
      )}

      {isMultiSelect && (
        <Animated.View entering={staggeredFadeInDown(step.content ? 1 : 0)}>
          <MultiSelectInputComponent
            options={(step.question as MultiSelectInput).options}
            selectedIds={selectedIds}
            onToggle={handleOptionPress}
          />
        </Animated.View>
      )}

      {isSlider && (
        <SliderInputComponent
          input={step.question as SliderInput}
          value={sliderValue}
          onValueChange={handleSliderValueChange}
          hint={step.hint}
        />
      )}

      {selectedOption?.feedback && (
        <Animated.View entering={staggeredFadeInDown(step.content ? 2 : 1)}>
          <Text variant="regular" style={[styles.feedbackText, tablet.feedbackText]}>
            {selectedOption.feedback.highlight} {selectedOption.feedback.text}
          </Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 24,
  },
  sliderContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  feedbackText: {
    fontSize: 13,
    color: theme.colors.black.opacity[50],
    lineHeight: 20,
    textAlign: "center",
    paddingHorizontal: 8,
  },
});

export default QuestionRenderer;
