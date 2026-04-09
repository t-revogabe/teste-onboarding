import { Redirect, Href } from "expo-router";

import { getFirstStepId } from "@/features/onboarding/utils/parse-onboarding";

function OnboardingIndex() {
  const firstStep = getFirstStepId();
  return <Redirect href={`/(onboarding)/${firstStep}` as Href} />;
}

export default OnboardingIndex;
