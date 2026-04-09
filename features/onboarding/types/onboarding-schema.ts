// ---------------------------------------------------------------------------
// Onboarding JSON Schema Types
// ---------------------------------------------------------------------------

// -- Navigation -------------------------------------------------------------

export interface ConditionalRule {
  when: string[];
  goto: string;
}

export interface ConditionalNext {
  type: "conditional";
  field: string;
  rules: ConditionalRule[];
  default: string;
}

export type StepNext = string | ConditionalNext;

// -- Content ----------------------------------------------------------------

export interface TextCardContent {
  type: "text-card";
  emoji?: string;
  text: string;
}

export type StepContent = TextCardContent;

// -- Options ----------------------------------------------------------------

export interface OptionFeedback {
  highlight: string;
  text: string;
}

export interface SelectOption {
  id: string;
  label: string;
  subtitle?: string;
  emoji?: string;
  image?: string;
  icon?: string;
  feedback?: OptionFeedback;
}

// -- Inputs -----------------------------------------------------------------

export interface SingleSelectInput {
  type: "single-select";
  options: SelectOption[];
}

export interface MultiSelectInput {
  type: "multi-select";
  options: SelectOption[];
}

export interface SliderHint {
  icon: string;
  label: string;
  text: string;
}

export interface SliderInput {
  type: "slider";
  min: number;
  max: number;
  default: number;
  step: number;
}

export type StepInput = SingleSelectInput | MultiSelectInput | SliderInput;

// -- Steps ------------------------------------------------------------------

export interface BaseStepDefinition {
  id: string;
  title?: string;
  subtitle?: string;
  next: StepNext | null;
  preview?: string;
  removePadding?: boolean;
}

export interface QuestionStepDefinition extends BaseStepDefinition {
  type: "question";
  title: string;
  subtitle: string;
  question: StepInput;
  skippable?: boolean;
  content?: StepContent;
  hint?: SliderHint;
}

export interface ShowcaseStepDefinition extends BaseStepDefinition {
  type: "showcase";
  component: string;
}

export type OnboardingStepDefinition = QuestionStepDefinition | ShowcaseStepDefinition;

// -- Top-level --------------------------------------------------------------

export interface OnboardingDefinition {
  id: string;
  firstStep: string;
  steps: OnboardingStepDefinition[];
}

export interface OnboardingSchema {
  version: number;
  onboarding: OnboardingDefinition;
}

// -- Answers ----------------------------------------------------------------

export type AnswerMap = Record<string, string | string[] | number | null>;
