import React from 'react';
import { TextInput, TextInputProps } from 'react-native';

interface InputProps extends Omit<TextInputProps, 'className'> {
  className?: string;
}

export function Input({ className = '', placeholderTextColor = '#6b7280', ...props }: InputProps) {
  return (
    <TextInput
      className={`border border-border rounded-lg px-3 py-2 text-foreground bg-background ${className}`}
      placeholderTextColor={placeholderTextColor}
      {...props}
    />
  );
}
