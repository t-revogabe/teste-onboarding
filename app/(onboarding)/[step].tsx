import { Redirect, useLocalSearchParams } from "expo-router";

import QuestionRenderer from "@/features/onboarding/components/questions/question-renderer";
import { ONBOARDING_SHOWCASE_REGISTRY } from "@/features/onboarding/constants/onboarding-showcase-registry";
import { getStepById, isQuestionStep, isShowcaseStep } from "@/features/onboarding/utils/parse-onboarding";

function OnboardingStep() {
  const { step } = useLocalSearchParams<{ step: string }>();
  const stepDefinition = getStepById(step);

  if (!stepDefinition) {
    console.error(`[Onboarding] Unknown step ID: "${step}"`);
    return <Redirect href="/(onboarding)/" />;
  }

  if (isQuestionStep(stepDefinition)) {
    return <QuestionRenderer stepId={step} />;
  }

  if (isShowcaseStep(stepDefinition)) {
    const ShowcaseComponent = ONBOARDING_SHOWCASE_REGISTRY[stepDefinition.component];

    if (!ShowcaseComponent) {
      console.error(`[Onboarding] Missing showcase component: "${stepDefinition.component}"`);
      return <Redirect href="/(onboarding)/" />;
    }

    return <ShowcaseComponent />;
  }

  console.error(`[Onboarding] Unknown step type on step "${step}"`);
  return <Redirect href="/(onboarding)/" />;
}

export default OnboardingStep;
