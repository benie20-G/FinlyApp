import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useExpenses } from '@/hooks/useExpenses';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Calendar, DollarSign, CircleAlert as AlertCircle, Trash2, CreditCard as Edit } from 'lucide-react-native';
import Colors from '@/constants/Colors';

export default function ExpenseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getExpenseById, deleteExpense, isLoading, error } = useExpenses();
  const [expense, setExpense] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    const fetchExpense = async () => {
      try {
        const data = await getExpenseById(id);
        setExpense(data);
      } catch (error) {
        console.error('Error fetching expense:', error);
      }
    };

    fetchExpense();
  }, [id]);

  const handleDelete = () => {
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
              Alert.alert(
                'Success',
                'Expense deleted successfully',
                [{ text: 'OK', onPress: () => router.back() }]
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to delete expense');
            }
          }
        },
      ]
    );
  };

  const handleEdit = () => {
    if (id) {
      router.push(`/expenses/edit/${id}`);
    }
  };
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading expense details...</Text>
      </View>
    );
  }

  if (error || !expense) {
    return (
      <View style={styles.errorContainer}>
        <AlertCircle size={32} color="#FF453A" style={styles.errorIcon} />
        <Text style={styles.errorText}>Error loading expense details</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.header}>
          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Amount</Text>
            <Text style={styles.amountValue}>
              -{formatCurrency(expense.amount)}
            </Text>
          </View>

          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: getCategoryColor(expense.category, 0.2) },
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                { color: getCategoryColor(expense.category) },
              ]}
            >
              {expense.category || 'Other'}
            </Text>
          </View>
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>Expense Details</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Name</Text>
            <Text style={styles.detailValue}>{expense.name}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date</Text>
            <View style={styles.dateContainer}>
              <Calendar size={16} color="#8E8E93" style={styles.dateIcon} />
              <Text style={styles.detailValue}>
                {formatDate(expense.createdAt)}
              </Text>
            </View>
          </View>

          {expense.description && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.detailLabel}>Description</Text>
              <Text style={styles.descriptionText}>{expense.description}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Trash2 size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Edit size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function getCategoryColor(category: string, opacity: number = 1): string {
  const categoryColors: { [key: string]: string } = {
    Food: opacity === 1 ? '#FF9500' : `rgba(255, 149, 0, ${opacity})`,
    Transportation: opacity === 1 ? '#FF2D55' : `rgba(255, 45, 85, ${opacity})`,
    Entertainment: opacity === 1 ? '#5AC8FA' : `rgba(90, 200, 250, ${opacity})`,
    Shopping: opacity === 1 ? '#007AFF' : `rgba(0, 122, 255, ${opacity})`,
    Housing: opacity === 1 ? '#5856D6' : `rgba(88, 86, 214, ${opacity})`,
    Utilities: opacity === 1 ? '#AF52DE' : `rgba(175, 82, 222, ${opacity})`,
    Healthcare: opacity === 1 ? '#FF3B30' : `rgba(255, 59, 48, ${opacity})`,
    Education: opacity === 1 ? '#34C759' : `rgba(52, 199, 89, ${opacity})`,
    Travel: opacity === 1 ? '#FFCC00' : `rgba(255, 204, 0, ${opacity})`,
  };
  
  return categoryColors[category] || (opacity === 1 ? '#64D2FF' : `rgba(100, 210, 255, ${opacity})`);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8E8E93',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F2F2F7',
  },
  errorIcon: {
    marginBottom: 16,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#0A84FF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    alignItems: 'center',
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  amountLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  categoryBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  detailLabel: {
    fontSize: 16,
    color: '#8E8E93',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    marginRight: 8,
  },
  descriptionContainer: {
    paddingVertical: 12,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1C1C1E',
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  deleteButton: {
    backgroundColor: '#FF453A',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 12,
  },
  editButton: {
    backgroundColor: '#0A84FF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});