import { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ScheduleData, ShiftData, ShiftType } from '../src/hooks/useScheduleTypes';
import type { Shift, User } from '../types';
import { ScheduleCalendar } from './ScheduleCalendar';
import { ShiftSelector } from './ShiftSelector';
import { AppHeader } from './ui/app-header';

interface WorkScheduleProps {
  user: User;
  selectedShift: Shift;
  onNavigate: (page: string) => void;
}

export function WorkSchedule({ user, selectedShift, onNavigate }: WorkScheduleProps) {
  const defaultShift: ShiftType = selectedShift;
  const [preferredShift, setPreferredShift] = useState<ShiftType>(defaultShift);

  const currentUserId = useMemo(() => {
    const parsed = Number(user.id);
    return Number.isFinite(parsed) ? parsed : 1;
  }, [user.id]);

  const [scheduleData, setScheduleData] = useState<ScheduleData>(() => ({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    employees: [
      {
        id: currentUserId,
        name: user.displayName,
        schedule: {},
      },
    ],
  }));

  const handleUpdateShift = (employeeId: number, day: number, shiftData: ShiftData) => {
    setScheduleData((prev) => ({
      ...prev,
      employees: prev.employees.map((employee) => {
        if (employee.id !== employeeId) return employee;
        return {
          ...employee,
          schedule: {
            ...employee.schedule,
            [day]: {
              shift: shiftData.shift || preferredShift,
              workplace: shiftData.workplace,
            },
          },
        };
      }),
    }));
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <AppHeader
        title="勤務表"
        subtitle={`${user.displayName} - ${user.department}`}
        onBack={() => onNavigate('index')}
      />

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, gap: 12 }}>
        <View className="bg-white rounded-xl border border-gray-200 p-3">
          <Text className="text-sm font-bold text-gray-700">デフォルト勤務帯</Text>
          <ShiftSelector value={preferredShift} onSelect={(shift) => setPreferredShift(shift)} />
        </View>

        <View className="rounded-xl overflow-hidden border border-gray-200 bg-white">
          <ScheduleCalendar
            scheduleData={scheduleData}
            currentUserId={currentUserId}
            onUpdateShift={handleUpdateShift}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
