import React from 'react';
import { Pressable, PressableProps, Text } from 'react-native';

interface ButtonProps extends PressableProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Button({ 
  children, 
  variant = 'default', 
  size = 'md', 
  className = '',
  ...props 
}: ButtonProps) {
  const baseClasses = 'flex-row items-center justify-center rounded-md';
  
  const variantClasses = {
    default: 'bg-primary',
    outline: 'border border-input bg-background',
    ghost: 'bg-transparent'
  };
  
  const sizeClasses = {
    sm: 'h-9 px-3',
    md: 'h-10 px-4 py-2',
    lg: 'h-11 px-8'
  };
  
  const textClasses = {
    default: 'text-primary-foreground',
    outline: 'text-foreground',
    ghost: 'text-foreground'
  };
  
  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <Pressable
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      <Text className={`font-medium ${textClasses[variant]} ${textSizeClasses[size]}`}>
        {children}
      </Text>
    </Pressable>
  );
}
