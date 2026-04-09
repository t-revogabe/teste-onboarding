export interface UpdateOnboardingStepRequest {
  onboarding_steps: Record<string, unknown>;
}

export interface GetOnboardingStartResponse {
  userId: string;
}

export interface GetOnboardingStartRequest {
  userId?: string;
}
