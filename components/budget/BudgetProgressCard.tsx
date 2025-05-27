import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ProgressBar from '@/components/ui/ProgressBar';
import { formatCurrency } from '@/utils/formatters';

interface BudgetProgressCardProps {
  budget: {
    category: string;
    limit: string;
    currentAmount: string;
  };
}

export default function BudgetProgressCard({ budget }: BudgetProgressCardProps) {
  const percentage = Math.min(100, (parseFloat(budget.currentAmount) / parseFloat(budget.limit)) * 100);
  
  let statusColor = '#30D158'; // Green for safe
  if (percentage >= 90) {
    statusColor = '#FF453A'; // Red for danger
  } else if (percentage >= 75) {
    statusColor = '#FF9500'; // Orange for warning
  }

  return (
    <View style={styles.card}>
      <Text style={styles.category}>{budget.category}</Text>
      <View style={styles.amountsRow}>
        <Text style={styles.currentAmount}>{formatCurrency(budget.currentAmount)}</Text>
        <Text style={styles.limitAmount}>/ {formatCurrency(budget.limit)}</Text>
      </View>
      <ProgressBar 
        progress={percentage} 
        color={statusColor}
        height={6}
        backgroundColor="#E5E5EA"
      />
      <Text style={styles.percentageText}>{percentage.toFixed(0)}% used</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#23242A',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 8,
    width: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  category: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  amountsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  currentAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  limitAmount: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 4,
  },
  percentageText: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 8,
  },
});