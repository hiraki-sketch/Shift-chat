import React from 'react';
import { Text, View } from 'react-native';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
  
  const variantClasses = {
    default: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    outline: 'border border-input bg-background text-foreground'
  };

  return (
    <View className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      <Text className="text-xs font-medium">
        {children}
      </Text>
    </View>
  );
}
