import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import theme from "@/constants/onboarding-theme";
import {
  OnboardingLayoutProvider,
  useOnboardingLayout,
} from "@/features/onboarding/contexts/onboarding-layout-context";
import OnboardingFooter from "@/features/onboarding/components/shared/onboarding-footer";
import OnboardingHeader from "@/features/onboarding/components/shared/onboarding-header";

function OnboardingLayoutContent() {
  const { backgroundElement } = useOnboardingLayout();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      {backgroundElement}

      <View
        style={[
          styles.container,
          { paddingTop: insets.top + 8, paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        <OnboardingHeader />

        <View style={styles.content}>
          <Slot />
        </View>

        <View style={styles.footer}>
          <OnboardingFooter />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: theme.padding.horizontal,
  },
  content: {
    flex: 1,
  },
  footer: {},
});

export default function OnboardingLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <OnboardingLayoutProvider>
        <OnboardingLayoutContent />
      </OnboardingLayoutProvider>
    </GestureHandlerRootView>
  );
}
