import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";

import { OnboardingLoadingState } from "../types/onboarding-loading";

interface FooterConfig {
  disabled: boolean;
  loading: OnboardingLoadingState;
  removeSkipButton?: boolean;
  hideFooter?: boolean;
  continueText?: string;
  skipText?: string;
}

interface OnboardingLayoutContextType {
  footerConfig: FooterConfig;
  setFooterConfig: (config: FooterConfig) => void;
  continueRef: React.RefObject<((skip?: boolean) => void) | null>;
  backgroundElement: ReactNode;
  setBackgroundElement: (element: ReactNode) => void;
}

const DEFAULT_FOOTER_CONFIG: FooterConfig = {
  disabled: true,
  loading: null,
  removeSkipButton: true,
};

const OnboardingLayoutContext = createContext<OnboardingLayoutContextType>({
  footerConfig: DEFAULT_FOOTER_CONFIG,
  setFooterConfig: () => {},
  continueRef: { current: null },
  backgroundElement: null,
  setBackgroundElement: () => {},
});

function OnboardingLayoutProvider({ children }: { children: ReactNode }) {
  const [footerConfig, setFooterConfig] = useState<FooterConfig>(DEFAULT_FOOTER_CONFIG);
  const [backgroundElement, setBackgroundElement] = useState<ReactNode>(null);
  const continueRef = useRef<((skip?: boolean) => void) | null>(null);

  return (
    <OnboardingLayoutContext.Provider
      value={{ footerConfig, setFooterConfig, continueRef, backgroundElement, setBackgroundElement }}
    >
      {children}
    </OnboardingLayoutContext.Provider>
  );
}

function useOnboardingLayout() {
  return useContext(OnboardingLayoutContext);
}

interface UseOnboardingFooterConfig {
  onContinue: (skip?: boolean) => void;
  disabled: boolean;
  loading: OnboardingLoadingState;
  removeSkipButton?: boolean;
  hideFooter?: boolean;
  continueText?: string;
  skipText?: string;
}

function useOnboardingFooter(config: UseOnboardingFooterConfig) {
  const { setFooterConfig, continueRef } = useOnboardingLayout();
  const { onContinue, disabled, loading, removeSkipButton, hideFooter, continueText, skipText } = config;

  const onContinueRef = useRef(onContinue);
  onContinueRef.current = onContinue;

  useEffect(() => {
    continueRef.current = (...args) => onContinueRef.current(...args);
  }, [continueRef]);

  const setConfig = useCallback(() => {
    setFooterConfig({ disabled, loading, removeSkipButton, hideFooter, continueText, skipText });
  }, [disabled, loading, removeSkipButton, hideFooter, continueText, skipText, setFooterConfig]);

  useEffect(() => {
    setConfig();
  }, [setConfig]);
}

export { OnboardingLayoutProvider, useOnboardingLayout, useOnboardingFooter };
export type { FooterConfig, UseOnboardingFooterConfig };
