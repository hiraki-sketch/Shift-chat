import React from 'react';
import { Text } from 'react-native';

interface LabelProps {
  children: React.ReactNode;
  className?: string;
}

export function Label({ children, className = '' }: LabelProps) {
  return (
    <Text className={`text-sm font-medium text-foreground mb-2 ${className}`}>
      {children}
    </Text>
  );
}
