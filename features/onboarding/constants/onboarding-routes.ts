import { getAllSteps } from "../utils/parse-onboarding";

const steps = getAllSteps();

export const ONBOARDING_ROUTES: Record<string, string> = Object.fromEntries(
  steps.map((step) => [step.id, `/(onboarding)/${step.id}`])
);

const VALID_STEP_IDS = new Set(steps.map((step) => step.id));

export function getStepIdFromRoute(segment: string): string | null {
  return VALID_STEP_IDS.has(segment) ? segment : null;
}
