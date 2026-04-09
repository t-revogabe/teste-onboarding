import { ActivityIndicator, Pressable, StyleSheet, ViewStyle, TextStyle } from "react-native";

import Text from "./text";
import theme from "@/constants/onboarding-theme";

interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: "primary" | "secondary" | "terciary";
  disabled?: boolean;
  isLoading?: boolean;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  textProps?: { variant?: "regular" | "medium" | "semibold" | "bold" };
}

function Button({
  children,
  onPress,
  variant = "primary",
  disabled = false,
  isLoading = false,
  style,
  textStyle,
  textProps,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isLoading}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        disabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === "primary" ? theme.colors.white[0] : theme.colors.primary} />
      ) : (
        <Text
          variant={textProps?.variant ?? "semibold"}
          style={[styles.baseText, styles[`${variant}Text`], textStyle]}
        >
          {children}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    height: 48,
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.gray[200],
  },
  terciary: {
    backgroundColor: "transparent",
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: theme.touchableOpacity.activeOpacity,
  },
  baseText: {
    fontSize: 16,
  },
  primaryText: {
    color: theme.colors.white[0],
  },
  secondaryText: {
    color: theme.colors.brown[500],
  },
  terciaryText: {
    color: theme.colors.gray[500],
  },
});

export default Button;
