import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useExpenses } from '@/hooks/useExpenses';
import Colors from '@/constants/Colors';

export default function EditExpenseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getExpenseById, updateExpense } = useExpenses();

  const [form, setForm] = useState({
    name: '',
    amount: '',
    description: '',
    createdAt: new Date(),
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchExpense = async () => {
      try {
        const data = await getExpenseById(id);
        setForm({
          name: data?.name ?? '',
          amount: String(data?.amount),
          description: data?.description || '',
          createdAt: new Date(data?.createdAt),
        });
      } catch (err) {
        Alert.alert('Error', 'Failed to load expense');
      }
    };

    fetchExpense();
  }, [id]);

  const handleChange = (field: string, value: string | Date) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.amount) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return;
    }

    try {
      await updateExpense(id, {
        name: form.name,
        amount: parseFloat(form.amount),
        description: form.description,
        createdAt: form.createdAt,
      });

      Alert.alert('Success', 'Expense updated successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err) {
      Alert.alert('Error', 'Failed to update expense');
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 20 }}
    >
      <Text style={styles.label}>Name</Text>
      <TextInput
        value={form.name}
        onChangeText={(text) => handleChange('name', text)}
        style={styles.input}
        placeholder="Enter name"
      />

      <Text style={styles.label}>Amount</Text>
      <TextInput
        value={form.amount}
        onChangeText={(text) => handleChange('amount', text)}
        style={styles.input}
        placeholder="Enter amount"
        keyboardType="decimal-pad"
      />

      {/* <Text style={styles.label}>Category</Text>
      <TextInput
        value={form.category}
        onChangeText={(text) => handleChange('category', text)}
        style={styles.input}
        placeholder="e.g. Food, Travel"
      /> */}

      <Text style={styles.label}>Description</Text>
      <TextInput
        value={form.description}
        onChangeText={(text) => handleChange('description', text)}
        style={[styles.input, { height: 80 }]}
        placeholder="Optional"
        multiline
      />

      <Text style={styles.label}>Date</Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.dateButton}
      >
        <Text>{form.createdAt.toDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={form.createdAt}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) handleChange('createdAt', selectedDate);
          }}
        />
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#181A20',
    flex: 1,
  },
  label: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 6,
    fontWeight: '500',
    color: '#CCCCCC',
  },
  input: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#23242A',
    color: '#FFFFFF',
  },
  dateButton: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#333',
    backgroundColor: '#23242A',
  },
  saveButton: {
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 12,
    marginTop: 30,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#181A20',
    fontWeight: '600',
    fontSize: 16,
  },
});
