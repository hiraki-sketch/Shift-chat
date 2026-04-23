import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useShiftSelectorManagement } from '../src/hooks/useShiftSelectorManagement';
import type { ShiftType } from '../src/hooks/useScheduleTypes';

interface ShiftSelectorProps {
  value: ShiftType;
  onSelect: (shift: ShiftType) => void;
}

export function ShiftSelector({ value, onSelect }: ShiftSelectorProps) {
  const { shiftOptions } = useShiftSelectorManagement();

  return (
    <View style={styles.container}>
      {shiftOptions.map((shift) => {
        const selected = value === shift;

        return (
          <Pressable
            key={shift}
            onPress={() => onSelect(shift)}
            style={[styles.option, selected && styles.optionSelected]}
          >
            <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
              {shift}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    minWidth: 72,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  optionText: {
    color: '#374151',
    fontSize: 13,
    fontWeight: '700',
  },
  optionTextSelected: {
    color: '#FFFFFF',
  },
});