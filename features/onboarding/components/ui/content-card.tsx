import { StyleSheet, View } from "react-native";

import Text from "@/components/text";
import theme from "@/constants/onboarding-theme";
import { useResponsive } from "@/hooks/use-responsive";
import type { TextCardContent } from "../../types/onboarding-schema";

interface ContentCardProps {
  content: TextCardContent;
}

function ContentCard({ content }: ContentCardProps) {
  const { responsiveFontSize, tabletStyles } = useResponsive();

  const tablet = tabletStyles({
    card: { paddingHorizontal: 28, paddingTop: 28, paddingBottom: 32 },
    emoji: { fontSize: responsiveFontSize(36) },
    text: { fontSize: responsiveFontSize(14), lineHeight: responsiveFontSize(22) },
  });

  return (
    <View style={[styles.card, tablet.card]}>
      {content.emoji && <Text style={[styles.emoji, tablet.emoji]}>{content.emoji}</Text>}
      <Text variant="regular" style={[styles.text, tablet.text]}>
        {content.text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background,
    borderWidth: 1.5,
    borderColor: theme.colors.gray[300],
    borderStyle: "dashed",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    gap: 12,
  },
  emoji: {
    fontSize: 36,
    textAlign: "center",
  },
  text: {
    fontSize: 14,
    color: theme.colors.black.opacity[60],
    lineHeight: 22,
    textAlign: "center",
  },
});

export default ContentCard;
