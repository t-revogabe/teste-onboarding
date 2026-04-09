import { useCallback, useState } from "react";

// TODO: Replace with your API call (e.g. using @tanstack/react-query or fetch)
async function completeOnboarding(): Promise<void> {
  // Example:
  // await fetch("/v1/users/onboarding/complete", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({}),
  // });
  console.log("[Onboarding] Onboarding completed!");
}

export function useCompleteOnboarding() {
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = useCallback(async () => {
    setIsPending(true);
    try {
      await completeOnboarding();
    } finally {
      setIsPending(false);
    }
  }, []);

  return { mutateAsync, isPending };
}
