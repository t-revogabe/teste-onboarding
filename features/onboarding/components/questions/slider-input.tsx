import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { Lock } from "lucide-react-native";

import Text from "@/components/text";
import theme from "@/constants/onboarding-theme";
import { useResponsive } from "@/hooks/use-responsive";
import type { SliderHint, SliderInput } from "../../types/onboarding-schema";
import { staggeredFadeInDown } from "../../utils/onboarding-animations";
import RangeSlider from "../ui/range-slider";
import InfoBanner from "../ui/info-banner";

interface SliderInputProps {
  input: SliderInput;
  value: number;
  onValueChange: (value: number) => void;
  hint?: SliderHint;
}

function SliderInputComponent({ input, value, onValueChange, hint }: SliderInputProps) {
  const { responsiveFontSize, tabletStyles } = useResponsive();

  const tablet = tabletStyles({
    hintContainer: { marginBottom: 32 },
    valueText: { fontSize: responsiveFontSize(100) },
    dragHint: { fontSize: responsiveFontSize(12) },
  });

  function renderHintIcon(iconName: string) {
    if (iconName === "lock") {
      return <Lock size={14} color={theme.colors.primary} />;
    }
    return null;
  }

  return (
    <View style={styles.content}>
      <Animated.View entering={staggeredFadeInDown(0)} style={styles.sliderSection}>
        <Text variant="bold" style={[styles.valueText, tablet.valueText]}>
          {value}
        </Text>

        <RangeSlider value={value} minimumValue={input.min} maximumValue={input.max} onValueChange={onValueChange} />

        <Text variant="regular" style={[styles.dragHint, tablet.dragHint]}>
          Drag slider to edit
        </Text>
      </Animated.View>

      {hint && (
        <Animated.View entering={staggeredFadeInDown(1)} style={[styles.hintContainer, tablet.hintContainer]}>
          <InfoBanner icon={renderHintIcon(hint.icon)} label={hint.label} text={hint.text} />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "space-between",
  },
  sliderSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  valueText: {
    fontSize: 100,
    color: theme.colors.primary,
    textAlign: "center",
  },
  dragHint: {
    fontSize: 12,
    color: theme.colors.gray[500],
    textAlign: "center",
    marginTop: 24,
  },
  hintContainer: {
    paddingHorizontal: 8,
    marginBottom: 16,
  },
});

export default SliderInputComponent;
