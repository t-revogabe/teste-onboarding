import { Image } from "react-native";

import type {
  OnboardingSchema,
  OnboardingStepDefinition,
  QuestionStepDefinition,
  ShowcaseStepDefinition,
} from "../types/onboarding-schema";
import onboardingData from "../constants/versions/onboarding-version-1.json";

// ---------------------------------------------------------------------------
// Runtime validation
// ---------------------------------------------------------------------------

function validateSchema(data: unknown): OnboardingSchema {
  if (!data || typeof data !== "object") {
    throw new Error("[Onboarding] JSON schema is not an object");
  }

  const obj = data as Record<string, unknown>;

  if (typeof obj.version !== "number") {
    throw new Error("[Onboarding] Missing or invalid 'version' field");
  }

  if (!obj.onboarding || typeof obj.onboarding !== "object") {
    throw new Error("[Onboarding] Missing 'onboarding' key in schema");
  }

  const onboarding = obj.onboarding as Record<string, unknown>;

  if (typeof onboarding.firstStep !== "string") {
    throw new Error("[Onboarding] 'firstStep' must be a string");
  }

  if (!Array.isArray(onboarding.steps) || onboarding.steps.length === 0) {
    throw new Error("[Onboarding] 'steps' must be a non-empty array");
  }

  for (const step of onboarding.steps) {
    const s = step as Record<string, unknown>;

    if (typeof s.id !== "string" || typeof s.type !== "string") {
      throw new Error(`[Onboarding] Each step must have 'id' and 'type'. Got: ${JSON.stringify(s)}`);
    }

    const isValidType = s.type === "question" || s.type === "showcase";
    if (!isValidType) {
      throw new Error(`[Onboarding] Unknown step type "${s.type}" on step "${s.id}"`);
    }
  }

  return data as OnboardingSchema;
}

// ---------------------------------------------------------------------------
// Parsed data (validated once at module load)
// ---------------------------------------------------------------------------

const schema = validateSchema(onboardingData);
const stepMap = new Map<string, OnboardingStepDefinition>(schema.onboarding.steps.map((step) => [step.id, step]));

function prefetchRemoteOptionImages(): void {
  const urls = new Set<string>();
  for (const step of schema.onboarding.steps) {
    if (step.type !== "question") continue;
    const q = step.question;
    if (q.type !== "single-select" && q.type !== "multi-select") continue;
    for (const opt of q.options) {
      if (opt.image && isRemoteUrl(opt.image)) {
        urls.add(opt.image);
      }
    }
  }
  for (const url of urls) {
    Image.prefetch(url).catch(() => {});
  }
}

prefetchRemoteOptionImages();

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function getOnboardingSchema(): OnboardingSchema {
  return schema;
}

export function getFirstStepId(): string {
  return schema.onboarding.firstStep;
}

export function getAllSteps(): OnboardingStepDefinition[] {
  return schema.onboarding.steps;
}

export function getStepById(stepId: string): OnboardingStepDefinition | undefined {
  return stepMap.get(stepId);
}

export function isQuestionStep(step: OnboardingStepDefinition): step is QuestionStepDefinition {
  return step.type === "question";
}

export function isShowcaseStep(step: OnboardingStepDefinition): step is ShowcaseStepDefinition {
  return step.type === "showcase";
}

export function isRemoteUrl(value: string): boolean {
  return /^https?:\/\//.test(value);
}
