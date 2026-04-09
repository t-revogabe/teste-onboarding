import { StyleSheet, View } from "react-native";

import theme from "@/constants/onboarding-theme";
import { OnboardingLayoutProvider } from "../../contexts/onboarding-layout-context";
import OnboardingHeader from "./onboarding-header";
import OnboardingFooter from "./onboarding-footer";

interface OnboardingLayoutProps {
  children: React.ReactNode;
}

function OnboardingLayout({ children }: OnboardingLayoutProps) {
  return (
    <OnboardingLayoutProvider>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <OnboardingHeader />
        </View>

        <View style={styles.content}>{children}</View>

        <View style={styles.footerContainer}>
          <OnboardingFooter />
        </View>
      </View>
    </OnboardingLayoutProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.padding.horizontal,
  },
  headerContainer: {
    paddingTop: 8,
  },
  content: {
    flex: 1,
  },
  footerContainer: {
    paddingBottom: 16,
  },
});

export default OnboardingLayout;
