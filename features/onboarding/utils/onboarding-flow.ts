import type { AnswerMap, OnboardingStepDefinition } from "../types/onboarding-schema";

import { getFirstStepId, getStepById } from "./parse-onboarding";
import { resolveNext } from "./resolve-next";

export function getStepsForFlow(answers: AnswerMap): OnboardingStepDefinition[] {
  const firstStepId = getFirstStepId();
  const firstStep = getStepById(firstStepId);

  if (!firstStep) {
    if (__DEV__) {
      console.error(`[Onboarding] firstStep "${firstStepId}" not found in steps array`);
    }
    return [];
  }

  const visited: OnboardingStepDefinition[] = [firstStep];
  const visitedIds = new Set<string>([firstStep.id]);

  let currentStep = firstStep;

  while (currentStep.next !== null) {
    const nextId = resolveNext(currentStep.next, answers);
    if (!nextId) break;

    const alreadyVisited = visitedIds.has(nextId);
    if (alreadyVisited) break;

    const nextStep = getStepById(nextId);
    if (!nextStep) {
      if (__DEV__) {
        console.warn(`[Onboarding] Step chain broken: "${currentStep.id}" references "${nextId}" which does not exist`);
      }
      break;
    }

    visited.push(nextStep);
    visitedIds.add(nextId);
    currentStep = nextStep;
  }

  return visited;
}

export function getNextStepId(currentStepId: string, answers: AnswerMap): string | null {
  const step = getStepById(currentStepId);
  if (!step) return null;
  return resolveNext(step.next, answers);
}
