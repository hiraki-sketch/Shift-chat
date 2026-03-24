import React from 'react';
import { Text, View } from 'react-native';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
  
  const variantClasses = {
    default: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    outline: 'border border-input bg-background text-foreground',
    destructive: 'bg-red-500 text-white'
  };

  const textClasses = {
    default: 'text-primary-foreground',
    secondary: 'text-secondary-foreground',
    outline: 'text-foreground',
    destructive: 'text-white',
  } as const;

  return (
    <View className={`${baseClasses} ${variantClasses[variant] ?? variantClasses.default} ${className}`}>
      <Text className={`text-xs font-medium ${textClasses[variant] ?? textClasses.default}`}>
        {children}
      </Text>
    </View>
  );
}
