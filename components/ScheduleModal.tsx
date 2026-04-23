import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useScheduleModalManagement } from '../src/hooks/useScheduleModalManagement';
import type { ShiftData } from '../src/hooks/useScheduleTypes';

interface ScheduleModalProps {
  visible: boolean;
  day: number | null;
  currentData: ShiftData;
  employeeName: string;
  onClose: () => void;
  onSave: (shiftData: ShiftData) => void;
}

export function ScheduleModal({
  visible,
  day,
  currentData,
  employeeName,
  onClose,
  onSave,
}: ScheduleModalProps) {
  const { state, data, actions } = useScheduleModalManagement({
    visible,
    currentData,
    onSave,
  });

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>{employeeName} さんの勤務入力</Text>
          <Text style={styles.subTitle}>{day ? `${day}日` : '-'} の勤務情報</Text>

          <Text style={styles.label}>勤務帯</Text>
          <View style={styles.options}>
            {data.shiftOptions.map((shift) => (
              <Pressable
                key={shift || 'empty'}
                onPress={() => actions.setSelectedShift(shift)}
                style={[
                  styles.optionButton,
                  state.selectedShift === shift && styles.optionButtonSelected,
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    state.selectedShift === shift && styles.optionTextSelected,
                  ]}
                >
                  {shift || '未入力'}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>勤務場所</Text>
          <TextInput
            value={state.workplace}
            onChangeText={actions.setWorkplace}
            placeholder="例: 第2工場 Aライン"
            style={styles.input}
          />

          <View style={styles.actions}>
            <Pressable onPress={onClose} style={[styles.actionButton, styles.cancelButton]}>
              <Text style={styles.cancelText}>キャンセル</Text>
            </Pressable>
            <Pressable
              onPress={actions.handleSave}
              style={[styles.actionButton, styles.saveButton]}
            >
              <Text style={styles.saveText}>保存</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.4)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  subTitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  label: {
    marginTop: 4,
    fontSize: 13,
    color: '#374151',
    fontWeight: '700',
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#F9FAFB',
  },
  optionButtonSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#DBEAFE',
  },
  optionText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
  optionTextSelected: {
    color: '#1D4ED8',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  actions: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  actionButton: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  saveButton: {
    backgroundColor: '#2563EB',
  },
  cancelText: {
    color: '#374151',
    fontWeight: '700',
  },
  saveText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
