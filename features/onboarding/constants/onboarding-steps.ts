import type { OnboardingStepDefinition } from "../types/onboarding-schema";
import { getAllSteps } from "../utils/parse-onboarding";

const steps = getAllSteps();

export const ONBOARDING_STEP_ENUM = Object.fromEntries(
  steps.map((step) => [step.id.toUpperCase().replace(/-/g, "_"), step.id])
) as Record<string, string>;

export const ONBOARDING_STEPS: OnboardingStepDefinition[] = steps;

export const REMOVE_PADDING_FROM_ONBOARDING_STEPS: string[] = steps
  .filter((step) => step.removePadding)
  .map((step) => step.id);
