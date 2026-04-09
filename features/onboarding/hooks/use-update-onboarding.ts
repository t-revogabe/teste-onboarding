import { useCallback, useState } from "react";
import type { UpdateOnboardingStepRequest } from "../types/onboarding";

// TODO: Replace with your API call (e.g. using @tanstack/react-query or fetch)
async function updateOnboarding(data: UpdateOnboardingStepRequest): Promise<void> {
  // Example:
  // await fetch("/v1/users/onboarding", {
  //   method: "PATCH",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ onboarding_steps: data.onboarding_steps }),
  // });
  console.log("[Onboarding] Step saved:", data.onboarding_steps);
}

export function useUpdateOnboarding() {
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = useCallback(async (data: UpdateOnboardingStepRequest) => {
    setIsPending(true);
    try {
      await updateOnboarding(data);
    } finally {
      setIsPending(false);
    }
  }, []);

  return { mutateAsync, isPending };
}
