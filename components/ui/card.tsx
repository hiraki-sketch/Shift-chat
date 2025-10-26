import React from 'react';
import { Text, View } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <View className={`bg-card rounded-lg border border-border shadow-sm ${className}`}>
      {children}
    </View>
  );
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <View className={`p-6 ${className}`}>
      {children}
    </View>
  );
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
  return (
    <Text className={`text-foreground font-semibold text-lg ${className}`}>
      {children}
    </Text>
  );
}

export function CardDescription({ children, className = '' }: CardDescriptionProps) {
  return (
    <Text className={`text-muted-foreground text-sm ${className}`}>
      {children}
    </Text>
  );
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <View className={`px-6 pb-6 ${className}`}>
      {children}
    </View>
  );
}
