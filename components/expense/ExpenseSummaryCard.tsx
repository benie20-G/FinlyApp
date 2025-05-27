import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatCurrency } from '@/utils/formatters';

interface ExpenseSummaryCardProps {
  title: string;
  amount: number;
  icon: React.ReactNode;
  color: string;
  textColor: string;
}

export default function ExpenseSummaryCard({
  title,
  amount,
  icon,
  color,
  textColor,
}: ExpenseSummaryCardProps) {
  return (
    <View style={[styles.card, { backgroundColor: color }]}>
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      <Text style={[styles.amount, { color: textColor }]}>{formatCurrency(amount)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    marginBottom: 4,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});