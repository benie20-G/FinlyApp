import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useExpenses } from '@/hooks/useExpenses';
import { useBudgets } from '@/hooks/useBudgets';
import { useAuth } from '@/hooks/useAuth';
import { PieChart, LineChart } from 'react-native-chart-kit';
import { formatCurrency } from '@/utils/formatters';
import { Dimensions } from 'react-native';
import { CircleAlert as AlertCircle, TrendingUp, TrendingDown, DollarSign, Bell } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import ExpenseSummaryCard from '@/components/expense/ExpenseSummaryCard';
import BudgetProgressCard from '@/components/budget/BudgetProgressCard';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
const screenWidth = Dimensions.get('window').width;

export default function DashboardScreen() {
  const { user } = useAuth();
  const navigation = useRouter();
  const { expenses, isLoading: expensesLoading, fetchExpenses } = useExpenses();
  const { budgets, isLoading: budgetsLoading } = useBudgets();
  const [refreshing, setRefreshing] = useState(false);
  const [totalSpent, setTotalSpent] = useState(0);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any>({
    labels: [],
    datasets: [{ data: [] }],
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const dummyNotifications = [
    { id: 1, text: 'Your Food budget is 90% used.' },
    { id: 2, text: 'New expense added: RWF 5,000.' },
    { id: 3, text: 'You have 3 budgets expiring soon.' },
  ];

  useEffect(() => {
    if (expenses.length > 0) {
      // Calculate total spent
      const total = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
      setTotalSpent(total);

      // Process category data for pie chart
      const categories: { [key: string]: number } = {};
      expenses.forEach((expense) => {
        const category = expense.category || 'Other';
        categories[category] = (categories[category] || 0) + parseFloat(expense.amount);
      });

      const colors = [
        '#34C759', '#FF2D55', '#5AC8FA', '#007AFF', '#5856D6',
        '#AF52DE', '#FF3B30', '#FFCC00', '#64D2FF', '#FF9500'
      ];

      const pieData = Object.keys(categories).map((category, index) => ({
        name: category,
        amount: categories[category],
        color: colors[index % colors.length],
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      }));

      setCategoryData(pieData);

      // Process monthly data for line chart
      const monthlyExpenses: { [key: string]: number } = {};
      const today = new Date();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(today.getMonth() - 5);

      for (let i = 0; i < 6; i++) {
        const month = new Date(sixMonthsAgo);
        month.setMonth(sixMonthsAgo.getMonth() + i);
        const monthKey = `${month.getFullYear()}-${month.getMonth() + 1}`;
        monthlyExpenses[monthKey] = 0;
      }

      expenses.forEach((expense) => {
        const expenseDate = new Date(expense.date);
        const monthKey = `${expenseDate.getFullYear()}-${expenseDate.getMonth() + 1}`;
        if (monthlyExpenses[monthKey] !== undefined) {
          monthlyExpenses[monthKey] += parseFloat(expense.amount);
        }
      });

      const months = Object.keys(monthlyExpenses).sort();
      const monthLabels = months.map(m => {
        const [year, month] = m.split('-');
        return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][parseInt(month) - 1];
      });
      
      setMonthlyData({
        labels: monthLabels,
        datasets: [
          {
            data: months.map(m => monthlyExpenses[m]),
            color: (opacity = 1) => `rgba(10, 132, 255, ${opacity})`,
            strokeWidth: 2,
          },
        ],
      });
    }
  }, [expenses]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchExpenses();
    setRefreshing(false);
  };

  if (expensesLoading || budgetsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading your financial data...</Text>
      </View>
    );
  }

  // Find most expensive category
  let maxCategory = { name: 'None', amount: 0 };
  if (categoryData.length > 0) {
    maxCategory = categoryData.reduce((max, cat) => cat.amount > max.amount ? cat : max, categoryData[0]);
  }

  // Get closest budget to limit
  const sortedBudgets = [...budgets].sort((a, b) => {
    const aPercentage = (parseFloat(a.currentAmount) / parseFloat(a.limit)) * 100;
    const bPercentage = (parseFloat(b.currentAmount) / parseFloat(b.limit)) * 100;
    return bPercentage - aPercentage;
  });

  const criticalBudget = sortedBudgets.length > 0 ? sortedBudgets[0] : null;
  const criticalPercentage = criticalBudget 
    ? (parseFloat(criticalBudget.currentAmount) / parseFloat(criticalBudget.limit)) * 100 
    : 0;

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: '#121212' }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 16 }}>
        <View>
          <Text style={[styles.greeting, { color: '#FFFFFF' }]}>Hello, {user?.name || 'User'}</Text>
          <Text style={[styles.date, { color: '#CCCCCC' }]}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
        </View>
        <TouchableOpacity onPress={() => setShowNotifications(true)}>
          <Bell size={28} color="#34C759" />
        </TouchableOpacity>
      </View>

      <View style={[styles.balanceCard, { backgroundColor: '#1E1E1E' }]}>
        <Text style={[styles.balanceLabel, { color: '#FFFFFF' }]}>Total Spent This Month</Text>
        <Text style={[styles.balanceAmount, { color: '#34C759' }]}>{formatCurrency(totalSpent)}</Text>
      </View>

      <View style={styles.summaryContainer}>
        <ExpenseSummaryCard 
          title="Highest Expense"
          amount={expenses.length > 0 ? Math.max(...expenses.map(e => parseFloat(e.amount))) : 0}
          icon={<TrendingUp size={20} color="#34C759" />}
          color="#1E1E1E"
          textColor="#34C759"
        />
        <ExpenseSummaryCard 
          title="Average Expense"
          amount={expenses.length > 0 ? totalSpent / expenses.length : 0}
          icon={<DollarSign size={20} color="#34C759" />}
          color="#1E1E1E"
          textColor="#34C759"
        />
      </View>

      {criticalBudget && criticalPercentage > 80 && (
        <View style={[styles.alertCard, { backgroundColor: '#1E1E1E' }]}>
          <AlertCircle size={24} color="#FF9500" style={styles.alertIcon} />
          <View style={styles.alertContent}>
            <Text style={[styles.alertTitle, { color: '#FFFFFF' }]}>Budget Alert</Text>
            <Text style={[styles.alertMessage, { color: '#CCCCCC' }]}>
              Your {criticalBudget.category} budget is {criticalPercentage.toFixed(0)}% used
            </Text>
          </View>
        </View>
      )}

      {budgets.length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: '#FFFFFF' }]}>Budget Progress</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.budgetsScroll}
          >
            {budgets.map((budget) => (
              <BudgetProgressCard key={budget.id} budget={budget} />
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.recentExpensesContainer}>
        <View style={styles.recentExpensesHeader}>
          <Text style={styles.sectionTitle}>Recent Expenses</Text>
          <TouchableOpacity onPress={() =>{
            // Navigate to expenses screen
            navigation.navigate('/(tabs)/expenses');
          }}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        {expenses.slice(0, 3).map((expense) => (
          <View key={expense.id} style={styles.expenseItem}>
            <View style={[styles.categoryDot, { backgroundColor: getCategoryColor(expense.category) }]} />
            <View style={styles.expenseDetails}>
              <Text style={styles.expenseTitle}>{expense.name}</Text>
              <Text style={styles.expenseCategory}>{expense.category || "Other"}</Text>
            </View>
            <View style={styles.expenseAmountContainer}>
              <Text style={styles.expenseAmount}>-{formatCurrency(expense.amount)}</Text>
              <Text style={styles.expenseDate}>
                {new Date(expense.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {showNotifications && (
        <>
          <BlurView intensity={60} tint="dark" style={{ ...StyleSheet.absoluteFillObject, zIndex: 99 }} />
          <View style={{ position: 'absolute', top: 60, right: 20, backgroundColor: '#23242A', borderRadius: 12, padding: 16, zIndex: 100, width: 280 }}>
            <Text style={{ color: '#34C759', fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>Notifications</Text>
            {dummyNotifications.map(n => (
              <Text key={n.id} style={{ color: '#FFFFFF', marginBottom: 6 }}>{n.text}</Text>
            ))}
            <TouchableOpacity onPress={() => setShowNotifications(false)} style={{ marginTop: 8, alignSelf: 'flex-end' }}>
              <Text style={{ color: '#34C759', fontWeight: 'bold' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
}

function getCategoryColor(category: string): string {
  const categoryColors: { [key: string]: string } = {
    Food: '#FF9500',
    Transportation: '#FF2D55',
    Entertainment: '#5AC8FA',
    Shopping: '#007AFF',
    Housing: '#5856D6',
    Utilities: '#AF52DE',
    Healthcare: '#FF3B30',
    Education: '#34C759',
    Travel: '#FFCC00',
  };
  
  return categoryColors[category] || '#64D2FF';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#CCCCCC',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  date: {
    fontSize: 14,
    color: '#CCCCCC',
    marginTop: 4,
  },
  balanceCard: {
    margin: 16,
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#34C759',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  alertCard: {
    margin: 16,
    marginTop: 0,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  alertIcon: {
    marginRight: 16,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  sectionContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  budgetsScroll: {
    paddingHorizontal: 8,
  },
  chartContainer: {
    marginBottom: 24,
  },
  chartCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    margin: 16,
    marginTop: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
  },
  lineChart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  insightCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightIcon: {
    marginRight: 12,
  },
  insightText: {
    fontSize: 14,
    color: '#FFFFFF',
    flex: 1,
  },
  insightHighlight: {
    fontWeight: 'bold',
    color: '#34C759',
  },
  recentExpensesContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    margin: 16,
    marginTop: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  recentExpensesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: '#34C759',
    fontWeight: '500',
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 16,
  },
  expenseDetails: {
    flex: 1,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  expenseCategory: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  expenseAmountContainer: {
    alignItems: 'flex-end',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  expenseDate: {
    fontSize: 12,
    color: '#CCCCCC',
  },
});