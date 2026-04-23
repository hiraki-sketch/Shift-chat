import { View, Text, StyleSheet } from 'react-native';
import { useShiftCellManagement } from '../src/hooks/useShiftCellManagement';
import type { ShiftData } from '../src/hooks/useScheduleTypes';

interface ShiftCellProps {
  shiftData: ShiftData;
  compact?: boolean;
}

export function ShiftCell({ shiftData, compact = false }: ShiftCellProps) {
  const { colors } = useShiftCellManagement(shiftData.shift);

  if (!shiftData.shift) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>タップして勤務を入力</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          compact ? styles.badgeCompact : styles.badge,
          {
            backgroundColor: colors.bg,
            borderColor: colors.border,
          },
        ]}
      >
        <Text
          style={[
            compact ? styles.badgeTextCompact : styles.badgeText,
            { color: colors.text },
          ]}
        >
          {shiftData.shift}
        </Text>
      </View>

      {!!shiftData.workplace && (
        <View style={compact ? styles.workplaceBoxCompact : styles.workplaceBox}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={compact ? styles.workplaceTextCompact : styles.workplaceText}
          >
            {shiftData.workplace}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  emptyContainer: {
    minHeight: 40,
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  badgeCompact: {
    alignSelf: 'flex-start',
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  badgeTextCompact: {
    fontSize: 11,
    fontWeight: '700',
  },
  workplaceBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  workplaceBoxCompact: {
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  workplaceText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
  workplaceTextCompact: {
    fontSize: 10,
    color: '#374151',
    fontWeight: '600',
  },
});