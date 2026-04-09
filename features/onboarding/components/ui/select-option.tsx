import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import Text from "@/components/text";
import theme from "@/constants/onboarding-theme";
import { useResponsive } from "@/hooks/use-responsive";

const SCALE_DOWN = { duration: 80, easing: Easing.inOut(Easing.ease) };
const SCALE_UP = { duration: 200, easing: Easing.out(Easing.ease) };

interface SelectOptionProps {
  label: string;
  subtitle?: string;
  emoji?: string;
  image?: ImageSourcePropType;
  icon?: React.ReactNode;
  isSelected: boolean;
  onPress: () => void;
}

function SelectOption({
  label,
  subtitle,
  emoji,
  image,
  icon,
  isSelected,
  onPress,
}: SelectOptionProps) {
  const { responsiveFontSize, tabletStyles } = useResponsive();
  const scale = useSharedValue(1);

  const tablet = tabletStyles({
    container: { paddingVertical: 16, paddingHorizontal: 16, gap: 18 },
    emojiContainer: { width: 52, height: 52, borderRadius: 16 },
    imageContainer: { width: 60, height: 60, borderRadius: 18 },
    emoji: { fontSize: responsiveFontSize(28) },
    label: { fontSize: responsiveFontSize(14) },
    labelWithImage: { fontSize: responsiveFontSize(16) },
    subtitle: { fontSize: responsiveFontSize(12) },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handlePress() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSequence(
      withTiming(0.97, SCALE_DOWN),
      withTiming(1, SCALE_UP),
    );
    onPress();
  }

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.container,
          image ? styles.containerWithImage : styles.containerWithEmoji,
          isSelected ? styles.containerSelected : styles.containerDefault,
          tablet.container,
          pressed && styles.pressed,
        ]}
      >
        {image && (
          <View style={[styles.imageContainer, tablet.imageContainer]}>
            <Image source={image} style={styles.image} resizeMode="cover" />
          </View>
        )}

        {!image && emoji && (
          <View
            style={[
              styles.emojiContainer,
              tablet.emojiContainer,
              isSelected && styles.emojiContainerSelected,
            ]}
          >
            <Text style={[styles.emoji, tablet.emoji]}>{emoji}</Text>
          </View>
        )}

        {icon && (
          <View style={[styles.emojiContainer, tablet.emojiContainer]}>
            {icon}
          </View>
        )}

        <View style={styles.textContainer}>
          <Text
            variant="medium"
            style={[
              styles.label,
              tablet.label,
              !!image && tablet.labelWithImage,
              isSelected && styles.labelSelected,
            ]}
          >
            {label}
          </Text>

          {subtitle && (
            <Text
              variant="regular"
              style={[
                styles.subtitle,
                tablet.subtitle,
                isSelected && styles.subtitleSelected,
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  containerWithImage: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 0,
  },
  containerWithEmoji: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 0,
  },
  containerDefault: {
    backgroundColor: theme.colors.gray[200],
  },
  containerSelected: {
    backgroundColor: theme.colors.primary,
  },
  pressed: {
    opacity: 0.75,
  },
  imageContainer: {
    width: 52,
    height: 52,
    borderRadius: 0,
    backgroundColor: theme.colors.white[0],
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  emojiContainer: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 0,
    backgroundColor: theme.colors.white[0],
  },
  emojiContainerSelected: {
    backgroundColor: theme.colors.white[0],
    opacity: 0.9,
  },
  emoji: {
    fontSize: 28,
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  label: {
    fontSize: 14,
    color: theme.colors.brown[500],
  },
  labelSelected: {
    color: theme.colors.white[0],
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.black.opacity[50],
    letterSpacing: -0.24,
  },
  subtitleSelected: {
    color: theme.colors.white[85],
  },
});

export default SelectOption;
