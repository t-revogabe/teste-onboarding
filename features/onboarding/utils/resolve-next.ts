import type { AnswerMap, ConditionalNext, StepNext } from "../types/onboarding-schema";

function resolveConditional(conditional: ConditionalNext, answers: AnswerMap): string {
  const answerValue = answers[conditional.field];

  if (answerValue === undefined) {
    if (__DEV__) {
      console.warn(
        `[Onboarding] resolveConditional: field "${conditional.field}" not found in answers. ` +
          `Falling back to default: "${conditional.default}". Available fields: ${Object.keys(answers).join(", ")}`
      );
    }
    return conditional.default;
  }

  for (const rule of conditional.rules) {
    const isStringMatch = typeof answerValue === "string" && rule.when.includes(answerValue);
    const isArrayMatch = Array.isArray(answerValue) && answerValue.some((v) => rule.when.includes(v));

    if (isStringMatch || isArrayMatch) {
      return rule.goto;
    }
  }

  return conditional.default;
}

export function resolveNext(next: StepNext | null, answers: AnswerMap): string | null {
  if (next === null) return null;
  if (typeof next === "string") return next;
  return resolveConditional(next, answers);
}
