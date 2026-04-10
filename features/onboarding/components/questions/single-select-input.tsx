import { ImageSourcePropType, ScrollView, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

import { ONBOARDING_ICON_REGISTRY } from "../../constants/onboarding-icon-registry";
import { ONBOARDING_IMAGE_REGISTRY } from "../../constants/onboarding-image-registry";
import type { SelectOption } from "../../types/onboarding-schema";
import { staggeredFadeInDown } from "../../utils/onboarding-animations";
import SelectOptionComponent from "../ui/select-option";

interface SingleSelectInputProps {
  options: SelectOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  iconRegistry?: Record<string, React.ComponentType<{ width: number; height: number }>>;
  imageRegistry?: Record<string, ImageSourcePropType>;
}

function SingleSelectInput({
  options,
  selectedId,
  onSelect,
  iconRegistry = ONBOARDING_ICON_REGISTRY,
  imageRegistry = ONBOARDING_IMAGE_REGISTRY,
}: SingleSelectInputProps) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
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
              isSelected={selectedId === option.id}
              onPress={() => onSelect(option.id)}
            />
          );
        })}
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 16,
  },
  optionsContainer: {
    gap: 18,
  },
});

export default SingleSelectInput;
