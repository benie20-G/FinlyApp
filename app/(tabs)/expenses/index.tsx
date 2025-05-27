import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useExpenses } from '@/hooks/useExpenses';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Calendar, Trash2, Search } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import ExpenseSearchBar from '@/components/expense/ExpenseSearchBar';
import EmptyState from '@/components/ui/EmptyState';
import { Expense } from '@/contexts/ExpensesContext';

export default function ExpensesScreen() {
  const router = useRouter();
  const { expenses, isLoading, error, fetchExpenses, deleteExpense } =
    useExpenses();
  const [refreshing, setRefreshing] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Reverse the expenses array to show newest first
    const reversedExpenses = [...expenses].reverse();

    if (searchQuery) {
      const filtered = reversedExpenses.filter(
        (expense) =>
          expense.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (expense.description &&
            expense.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
      );
      setFilteredExpenses(filtered);
    } else {
      setFilteredExpenses(reversedExpenses);
    }
  }, [expenses, searchQuery]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchExpenses();
    setRefreshing(false);
  };

  const handleExpensePress = (id: string) => {
    router.push(`/expenses/${id}`);
  };

  const handleDeleteExpense = (id: string) => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteExpense(id);
              Alert.alert('Success', 'Expense deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete expense');
            }
          },
        },
      ]
    );
  };

  const renderExpenseItem = ({ item }: { item: Expense }) => (
    <TouchableOpacity
      style={styles.expenseCard}
      onPress={() => handleExpensePress(item.id)}
    >
      <View style={styles.expenseHeader}>
        <View style={styles.expenseInfo}>
          <Text style={styles.expenseTitle}>{item.name}</Text>
          <View style={styles.expenseMeta}>
            <View
              style={[
                styles.categoryPill,
                { backgroundColor: getCategoryColor('Other', 0.2) },
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  { color: getCategoryColor('Other') },
                ]}
              >
                Other
              </Text>
            </View>
            <View style={styles.dateContainer}>
              <Calendar size={14} color="#8E8E93" style={styles.dateIcon} />
              <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.expenseAmount}>-{formatCurrency(item.amount)}</Text>
      </View>

      {item.description && (
        <Text style={styles.expenseDescription} numberOfLines={2}>
          {item.description}
        </Text>
      )}

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteExpense(item.id)}
        >
          <Trash2 size={16} color="#FF453A" />
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (isLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading expenses...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading expenses</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchExpenses}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowSearch(!showSearch)}
        >
          <Search size={18} color={Colors.primary} />
          <Text style={styles.actionText}>Search</Text>
        </TouchableOpacity>
      </View>

      {showSearch && (
        <ExpenseSearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />
      )}

      {filteredExpenses.length === 0 ? (
        <EmptyState
          title="No expenses found"
          message={
            searchQuery
              ? 'Try changing your search query'
              : 'Add your first expense'
          }
          icon="receipt"
          actionLabel="Add Expense"
          onAction={() => router.push('/expenses/new')}
        />
      ) : (
        <FlatList
          data={filteredExpenses}
          keyExtractor={(item) => item.id}
          renderItem={renderExpenseItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

function getCategoryColor(category: string, opacity: number = 1): string {
  const categoryColors: { [key: string]: string } = {
    Food: `rgba(255, 149, 0, ${opacity})`,
    Transportation: `rgba(255, 45, 85, ${opacity})`,
    Entertainment: `rgba(90, 200, 250, ${opacity})`,
    Shopping: `rgba(0, 122, 255, ${opacity})`,
    Housing: `rgba(88, 86, 214, ${opacity})`,
    Utilities: `rgba(175, 82, 222, ${opacity})`,
    Healthcare: `rgba(255, 59, 48, ${opacity})`,
    Education: `rgba(52, 199, 89, ${opacity})`,
    Travel: `rgba(255, 204, 0, ${opacity})`,
  };

  return opacity === 1
    ? categoryColors[category]?.replace(`, ${opacity}`, '') || '#64D2FF'
    : categoryColors[category] || `rgba(100, 210, 255, ${opacity})`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181A20',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    backgroundColor: '#23242A',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23242A',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  actionText: {
    color: '#34C759',
    marginLeft: 8,
    fontWeight: '500',
  },
  expenseCard: {
    backgroundColor: '#23242A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseTitle: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  expenseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  categoryPill: {
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 8,
    marginRight: 8,
    backgroundColor: 'rgba(52,199,89,0.15)',
  },
  categoryText: {
    color: '#34C759',
    fontWeight: '500',
    fontSize: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    marginRight: 4,
  },
  dateText: {
    color: '#CCCCCC',
    fontSize: 12,
  },
  expenseAmount: {
    color: '#34C759',
    fontWeight: '700',
    fontSize: 16,
  },
  expenseDescription: {
    color: '#CCCCCC',
    marginTop: 8,
    fontSize: 14,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D2F36',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  deleteText: {
    color: '#FF453A',
    marginLeft: 6,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#181A20',
  },
  loadingText: {
    color: '#CCCCCC',
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#181A20',
  },
  errorText: {
    color: '#FF453A',
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#23242A',
    borderRadius: 8,
    padding: 12,
  },
  retryText: {
    color: '#34C759',
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
});
