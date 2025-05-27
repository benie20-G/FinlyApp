import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useExpenses } from '@/hooks/useExpenses';
import { validateAmount, validateRequired } from '@/utils/validation';
import {
  Calendar,
  DollarSign,
  CircleAlert as AlertCircle,
} from 'lucide-react-native';
import DateTimePicker from '@/components/ui/DateTimePicker';
import Colors from '@/constants/Colors';

export default function NewExpenseScreen() {
  const router = useRouter();
  const { addExpense, isLoading } = useExpenses();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [description, setDescription] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [titleError, setTitleError] = useState('');
  const [amountError, setAmountError] = useState('');

  const validateForm = () => {
    let isValid = true;

    const titleValidation = validateRequired(title, 'Title');
    setTitleError(titleValidation);
    if (titleValidation) isValid = false;

    const amountValidation = validateAmount(amount);
    setAmountError(amountValidation);
    if (amountValidation) isValid = false;

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await addExpense({
        name: title,
        amount,
        createdAt: date.toISOString(),
        description,
      });

      Alert.alert('Success', 'Expense added successfully', [
        { text: 'OK', onPress: () => router.push('/expenses') },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add expense. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Expense Details</Text>

          {/* Title Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={[styles.input, titleError ? styles.inputError : null]}
              placeholder="e.g., Grocery Shopping"
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                setTitleError('');
              }}
            />
            {titleError ? (
              <View style={styles.errorContainer}>
                <AlertCircle size={16} color="#FF453A" />
                <Text style={styles.errorText}>{titleError}</Text>
              </View>
            ) : null}
          </View>

          {/* Amount Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount *</Text>
            <View
              style={[
                styles.amountInputContainer,
                amountError ? styles.inputError : null,
              ]}
            >
              <DollarSign size={20} color="#8E8E93" style={styles.amountIcon} />
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={(text) => {
                  setAmount(text);
                  setAmountError('');
                }}
              />
            </View>
            {amountError ? (
              <View style={styles.errorContainer}>
                <AlertCircle size={16} color="#FF453A" />
                <Text style={styles.errorText}>{amountError}</Text>
              </View>
            ) : null}
          </View>

          {/* Date Picker */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Calendar size={20} color="#8E8E93" style={styles.dateIcon} />
              <Text style={styles.dateText}>
                {date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Description Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Add notes about this expense"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
          disabled={isLoading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.saveButtonText}>Save Expense</Text>
          )}
        </TouchableOpacity>
      </View>

      <DateTimePicker
        isVisible={showDatePicker}
        mode="date"
        onConfirm={(date) => {
          setDate(date);
          setShowDatePicker(false);
        }}
        onCancel={() => setShowDatePicker(false)}
        date={date}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181A20',
  },
  scrollContainer: {
    backgroundColor: '#181A20',
  },
  formContainer: {
    backgroundColor: '#23242A',
    borderRadius: 16,
    padding: 20,
    margin: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: '#CCCCCC',
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#23242A',
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#FF453A',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23242A',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    paddingHorizontal: 8,
  },
  amountIcon: {
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    backgroundColor: 'transparent',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23242A',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    padding: 12,
  },
  dateIcon: {
    marginRight: 8,
  },
  dateText: {
    color: '#CCCCCC',
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  errorText: {
    color: '#FF453A',
    marginLeft: 6,
    fontSize: 13,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#181A20',
  },
  cancelButton: {
    backgroundColor: '#23242A',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  cancelButtonText: {
    color: '#CCCCCC',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#34C759',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  saveButtonText: {
    color: '#181A20',
    fontWeight: '700',
  },
});
