import { Pressable, StyleSheet, ViewStyle } from "react-native";

import theme from "@/constants/onboarding-theme";

interface IconButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: "primary" | "secondary";
  style?: ViewStyle | ViewStyle[];
}

function IconButton({ children, onPress, variant = "primary", style }: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles.pressed,
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    width: 32,
    height: 32,
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.gray[200],
  },
  pressed: {
    opacity: theme.touchableOpacity.activeOpacity,
  },
});

export default IconButton;
