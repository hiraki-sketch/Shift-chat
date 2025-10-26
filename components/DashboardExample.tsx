import React, { useState } from 'react';
import { View } from 'react-native';
import { Shift, User } from '../types';
import { Dashboard } from './Dashboard';

export function DashboardExample() {
  const [selectedShift, setSelectedShift] = useState<Shift>('1勤');
  
  const mockUser: User = {
    id: '1',
    displayName: '平木友隆',
    department: '製造部',
    email: '@example.com'
  };

  const handleShiftChange = (shift: Shift) => {
    setSelectedShift(shift);
    console.log('勤務帯が変更されました:', shift);
  };

  const handleNavigate = (page: string) => {
    console.log('ページに移動します:', page);
    // ここでexpo-routerのnavigationを使用
    // router.push(`/${page}`);
  };

  return (
    <View className="flex-1">
      <Dashboard
        user={mockUser}
        selectedShift={selectedShift}
        onShiftChange={handleShiftChange}
        onNavigate={handleNavigate}
      />
    </View>
  );
}
