import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import Text from "@/components/text";
import theme from "@/constants/onboarding-theme";
import { useResponsive } from "@/hooks/use-responsive";

interface InfoBannerProps {
  icon: ReactNode;
  label: string;
  text: string;
}

function InfoBanner({ icon, label, text }: InfoBannerProps) {
  const { responsiveFontSize, tabletStyles } = useResponsive();

  const tablet = tabletStyles({
    badge: { paddingHorizontal: 14, paddingVertical: 8, gap: 6 },
    container: { gap: 14 },
    badgeText: { fontSize: responsiveFontSize(14) },
    text: { fontSize: responsiveFontSize(14) },
  });

  return (
    <View style={[styles.container, tablet.container]}>
      <View style={[styles.badge, tablet.badge]}>
        {icon}
        <Text variant="semibold" style={[styles.badgeText, tablet.badgeText]}>
          {label}
        </Text>
      </View>
      <Text variant="regular" style={[styles.text, tablet.text]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primaryOpacity,
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 4,
  },
  badgeText: {
    fontSize: 13,
    color: theme.colors.primary,
  },
  text: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.black.opacity[50],
  },
});

export default InfoBanner;
