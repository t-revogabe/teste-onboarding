import { Text as RNText, TextProps as RNTextProps, StyleSheet } from "react-native";

import theme from "@/constants/onboarding-theme";

interface TextProps extends RNTextProps {
  variant?: "regular" | "medium" | "semibold" | "bold";
  children: React.ReactNode;
}

function Text({ variant = "regular", style, children, ...props }: TextProps) {
  return (
    <RNText style={[styles.base, styles[variant], style]} {...props}>
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  base: {
    fontSize: 14,
    color: theme.colors.text[0],
  },
  regular: {
    fontWeight: "400",
  },
  medium: {
    fontWeight: "500",
  },
  semibold: {
    fontWeight: "600",
  },
  bold: {
    fontWeight: "700",
  },
});

export default Text;
