import { create } from "zustand";

import type { AnswerMap } from "../types/onboarding-schema";

interface OnboardingStore {
  data: {
    userId: string | null;
    answers: AnswerMap;
    history: string[];
  };
  setAnswer: (stepId: string, answer: string | string[] | number | null) => void;
  pushHistory: (stepId: string) => void;
  popHistory: () => string | undefined;
  setUserId: (userId: string) => void;
  getUserId: () => string | null;
  reset: () => void;
}

const INITIAL_STATE = {
  data: {
    userId: null as string | null,
    answers: {} as AnswerMap,
    history: [] as string[],
  },
};

export const useOnboardingStore = create<OnboardingStore>()((set, get) => ({
  ...INITIAL_STATE,
  setAnswer: (stepId: string, answer: string | string[] | number | null) => {
    set({
      data: {
        ...get().data,
        answers: { ...get().data.answers, [stepId]: answer },
      },
    });
  },
  pushHistory: (stepId: string) => {
    const currentHistory = get().data.history;
    const isDuplicate = currentHistory[currentHistory.length - 1] === stepId;
    if (isDuplicate) return;

    set({
      data: {
        ...get().data,
        history: [...currentHistory, stepId],
      },
    });
  },
  popHistory: () => {
    const history = get().data.history;
    if (history.length === 0) return undefined;

    const lastStepId = history[history.length - 1];
    set({
      data: {
        ...get().data,
        history: history.slice(0, -1),
      },
    });
    return lastStepId;
  },
  setUserId: (userId: string) => {
    set({ data: { ...get().data, userId } });
  },
  getUserId: () => get().data.userId,
  reset: () => set(INITIAL_STATE),
}));
