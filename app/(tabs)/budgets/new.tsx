import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';

export default function NewBudgetScreen() {
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [period, setPeriod] = useState('');
  const router = useRouter();

  const handleSave = () => {
    if (!category || !limit || !period) {
      Alert.alert('Validation Error', 'Please fill in all fields');
      return;
    }

    // TODO: Save budget to backend or state management
    console.log({ category, limit, period });

    Alert.alert('Success', 'Budget created successfully');

    // Navigate back to Budgets page
    router.replace('/budgets');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create New Budget</Text>

      <Text style={styles.label}>Category</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Food"
        placeholderTextColor="#999"
        value={category}
        onChangeText={setCategory}
      />

      <Text style={styles.label}>Limit</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 300"
        placeholderTextColor="#999"
        keyboardType="numeric"
        value={limit}
        onChangeText={setLimit}
      />

      <Text style={styles.label}>Period</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Monthly"
        placeholderTextColor="#999"
        value={period}
        onChangeText={setPeriod}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#181A20',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#23242A',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
