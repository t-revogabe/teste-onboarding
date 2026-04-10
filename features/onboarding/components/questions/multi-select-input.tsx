import { ImageSourcePropType, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

import { ONBOARDING_ICON_REGISTRY } from "../../constants/onboarding-icon-registry";
import { ONBOARDING_IMAGE_REGISTRY } from "../../constants/onboarding-image-registry";
import type { SelectOption } from "../../types/onboarding-schema";
import { staggeredFadeInDown } from "../../utils/onboarding-animations";
import SelectOptionComponent from "../ui/select-option";

interface MultiSelectInputProps {
  options: SelectOption[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  iconRegistry?: Record<string, React.ComponentType<{ width: number; height: number }>>;
  imageRegistry?: Record<string, ImageSourcePropType>;
}

function MultiSelectInput({
  options,
  selectedIds,
  onToggle,
  iconRegistry = ONBOARDING_ICON_REGISTRY,
  imageRegistry = ONBOARDING_IMAGE_REGISTRY,
}: MultiSelectInputProps) {
  return (
    <Animated.View entering={staggeredFadeInDown(0)} style={styles.optionsContainer}>
      {options.map((option) => {
        const image = option.image
          ? /^https?:\/\//.test(option.image)
            ? { uri: option.image }
            : imageRegistry[option.image]
          : undefined;
        const IconComponent = option.icon ? iconRegistry[option.icon] : undefined;
        const icon = IconComponent ? <IconComponent width={24} height={24} /> : undefined;

        return (
          <SelectOptionComponent
            key={option.id}
            label={option.label}
            subtitle={option.subtitle}
            emoji={option.emoji}
            image={image}
            icon={icon}
            isSelected={selectedIds.includes(option.id)}
            onPress={() => onToggle(option.id)}
          />
        );
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  optionsContainer: {
    gap: 12,
  },
});

export default MultiSelectInput;
