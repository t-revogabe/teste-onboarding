import { type Href, router } from "expo-router";
import { useCallback } from "react";

import { ONBOARDING_ROUTES } from "../constants/onboarding-routes";
import { useOnboardingStore } from "../stores/onboarding-store";
import { getNextStepId } from "../utils/onboarding-flow";
import { getFirstStepId } from "../utils/parse-onboarding";

interface UseOnboardingNavigationOptions {
  notSure?: boolean;
  skipTracking?: boolean;
}

// Optional analytics callback — wire your Mixpanel/analytics here
type TrackFn = (event: string, properties: Record<string, unknown>) => void;

export function useOnboardingNavigation(
  currentStepId: string,
  track?: TrackFn,
) {
  const { data, pushHistory, popHistory } = useOnboardingStore();
  const answers = data.answers;

  const goToNextStep = useCallback(
    (options: UseOnboardingNavigationOptions = {}) => {
      const { notSure, skipTracking } = options;
      const answer = notSure ? "not-sure" : answers[currentStepId];

      const nextStepId = getNextStepId(currentStepId, answers);
      if (!nextStepId) return;

      const route = ONBOARDING_ROUTES[nextStepId];
      if (!route) return;

      if (!skipTracking && track) {
        track("onboarding_next_step_pressed", {
          current_step_id: currentStepId,
          next_step_id: nextStepId,
          answer,
        });
      }

      pushHistory(currentStepId);
      router.push(route as Href);
    },
    [currentStepId, answers, pushHistory, track],
  );

  const goToPreviousStep = useCallback(() => {
    const previousStepId = popHistory();

    if (track) {
      track("onboarding_previous_step_pressed", {
        current_step_id: currentStepId,
        previous_step_id: previousStepId ?? null,
      });
    }

    const canGoBack = router.canGoBack();
    if (canGoBack) {
      router.back();
      return;
    }

    const targetStepId = previousStepId ?? getFirstStepId();
    const route = ONBOARDING_ROUTES[targetStepId];
    if (route) {
      router.replace(route as Href);
    }
  }, [currentStepId, popHistory, track]);

  return { goToNextStep, goToPreviousStep };
}
