import React from 'react';
import { Text, View } from 'react-native';

interface AlertProps {
  children: React.ReactNode;
  className?: string;
}

interface AlertDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function Alert({ children, className = '' }: AlertProps) {
  return (
    <View className={`relative w-full rounded-lg border border-border bg-background p-4 ${className}`}>
      {children}
    </View>
  );
}

export function AlertDescription({ children, className = '' }: AlertDescriptionProps) {
  return (
    <Text className={`text-sm text-muted-foreground ${className}`}>
      {children}
    </Text>
  );
}
