import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, useSharedValue } from "react-native-reanimated";

import Text from "@/components/text";
import theme from "@/constants/onboarding-theme";
import { useResponsive } from "@/hooks/use-responsive";

import { SLIDER_GAP, SLIDER_TRACK_HEIGHT } from "../../constants/slider";

interface RangeSliderProps {
  value: number;
  minimumValue: number;
  maximumValue: number;
  onValueChange: (value: number) => void;
}

function RangeSlider({ value, minimumValue, maximumValue, onValueChange }: RangeSliderProps) {
  const { responsiveFontSize, tabletStyles } = useResponsive();
  const trackWidth = useSharedValue(0);
  const progress = (value - minimumValue) / (maximumValue - minimumValue);

  const tablet = tabletStyles({
    filledTrack: { height: 14 },
    emptyTrack: { height: 14 },
    thumb: { height: 36, width: 46 },
    thumbText: { fontSize: responsiveFontSize(13) },
    rangeLabel: { fontSize: responsiveFontSize(13) },
  });

  function valueFromX(x: number) {
    "worklet";
    const ratio = Math.max(0, Math.min(x, trackWidth.value)) / trackWidth.value;
    return Math.round(minimumValue + ratio * (maximumValue - minimumValue));
  }

  const gesture = Gesture.Race(
    Gesture.Pan()
      .onBegin((e) => runOnJS(onValueChange)(valueFromX(e.x)))
      .onUpdate((e) => runOnJS(onValueChange)(valueFromX(e.x)))
      .hitSlop({ top: 16, bottom: 16 }),
    Gesture.Tap().onEnd((e) => runOnJS(onValueChange)(valueFromX(e.x)))
  );

  return (
    <View style={styles.container}>
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={styles.trackRow}
          onLayout={(e) => {
            trackWidth.value = e.nativeEvent.layout.width;
          }}
        >
          <View style={[styles.filledTrack, tablet.filledTrack, { flex: progress }]} />

          <View style={[styles.thumb, tablet.thumb]}>
            <Text variant="semibold" style={[styles.thumbText, tablet.thumbText]}>
              {value}
            </Text>
          </View>

          <View style={[styles.emptyTrack, tablet.emptyTrack, { flex: 1 - progress }]} />
        </Animated.View>
      </GestureDetector>

      <View style={styles.rangeLabels}>
        <Text variant="regular" style={[styles.rangeLabel, tablet.rangeLabel]}>
          {minimumValue}
        </Text>
        <Text variant="regular" style={[styles.rangeLabel, tablet.rangeLabel]}>
          {maximumValue}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  trackRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SLIDER_GAP,
    paddingVertical: 10,
  },
  filledTrack: {
    height: SLIDER_TRACK_HEIGHT,
    backgroundColor: theme.colors.primary,
    borderRadius: 100,
    minWidth: 0,
  },
  emptyTrack: {
    height: SLIDER_TRACK_HEIGHT,
    backgroundColor: theme.colors.black.opacity[10],
    borderRadius: 100,
    minWidth: 0,
  },
  thumb: {
    height: 28,
    width: 36,
    borderRadius: 100,
    backgroundColor: theme.colors.brown[500],
    alignItems: "center",
    justifyContent: "center",
  },
  thumbText: {
    fontSize: 13,
    color: theme.colors.white[0],
  },
  rangeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },
  rangeLabel: {
    fontSize: 13,
    color: theme.colors.black.opacity[50],
  },
});

export default RangeSlider;
