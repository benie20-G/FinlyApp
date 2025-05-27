import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChartBar as BarChart2, Receipt, ChartPie as PieChart, ShoppingCart } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface EmptyStateProps {
  title: string;
  message: string;
  icon: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title,
  message,
  icon,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const renderIcon = () => {
    switch (icon) {
      case 'receipt':
        return <Receipt size={64} color="#8E8E93" />;
      case 'pie-chart':
        return <PieChart size={64} color="#8E8E93" />;
      case 'bar-chart':
        return <BarChart2 size={64} color="#8E8E93" />;
      case 'shopping-cart':
        return <ShoppingCart size={64} color="#8E8E93" />;
      default:
        return <Receipt size={64} color="#8E8E93" />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {renderIcon()}
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction && (
        <TouchableOpacity style={styles.button} onPress={onAction}>
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    marginBottom: 24,
    opacity: 0.6,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});