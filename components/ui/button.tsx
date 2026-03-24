import React from 'react';
import { Pressable, PressableProps, Text } from 'react-native';

interface ButtonProps extends PressableProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export function Button({ 
  children, 
  // 指定がない場合は outline にして、スタイルが崩れにくいようにする
  variant = 'outline', 
  size = 'md', 
  className = '',
  disabled = false,
  ...props 
}: ButtonProps) {
  const baseClasses = 'flex-row items-center justify-center rounded-md';
  
  const variantClasses = {
    default: 'bg-primary',
    // outline は背景を塗らない（ライトで白になって見づらいのを防ぐ）
    outline: 'border border-input bg-transparent',
    ghost: 'bg-transparent',
    destructive: 'bg-red-500',
    secondary: 'bg-muted'
  };
  
  const sizeClasses = {
    sm: 'h-9 px-3',
    md: 'h-10 px-4 py-2',
    lg: 'h-11 px-8'
  };
  
  const textClasses = {
    // Pure white より少し落として読みやすくする
    default: 'text-gray-50',
    outline: 'text-gray-900 dark:text-gray-100',
    ghost: 'text-gray-900 dark:text-gray-100',
    destructive: 'text-gray-50',
    secondary: 'text-gray-900 dark:text-gray-100'
  };
  
  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const isTextOnly = typeof children === 'string';
  return (
    <Pressable
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-50' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {isTextOnly ? (
        <Text className={`font-medium ${textClasses[variant]} ${textSizeClasses[size]}`}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
