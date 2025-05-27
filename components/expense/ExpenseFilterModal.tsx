import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { X, Filter, Calendar } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import CategoryPicker from './CategoryPicker';
import DateTimePicker from '@/components/ui/DateTimePicker';

interface ExpenseFilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: {
    category: string;
    dateFrom: Date | null;
    dateTo: Date | null;
    minAmount: string;
    maxAmount: string;
  };
  setFilters: (filters: any) => void;
  onClearFilters: () => void;
  expenses: any[];
}

export default function ExpenseFilterModal({
  visible,
  onClose,
  filters,
  setFilters,
  onClearFilters,
  expenses,
}: ExpenseFilterModalProps) {
  const [localFilters, setLocalFilters] = useState(filters);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);

  // Get unique categories from expenses
  const categories = [...new Set(expenses.map(expense => expense.category))];

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters, visible]);

  const handleApplyFilters = () => {
    setFilters(localFilters);
    onClose();
  };

  const handleClearFilters = () => {
    onClearFilters();
    setLocalFilters({
      category: '',
      dateFrom: null,
      dateTo: null,
      minAmount: '',
      maxAmount: '',
    });
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Select date';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <SafeAreaView style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Filter Expenses</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#8E8E93" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.filtersContainer}>
            {/* Category Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Category</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setShowCategoryPicker(true)}
              >
                {localFilters.category ? (
                  <Text style={styles.selectedValue}>{localFilters.category}</Text>
                ) : (
                  <Text style={styles.placeholderText}>Select category</Text>
                )}
              </TouchableOpacity>
            </View>
            
            {/* Date Range Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Date Range</Text>
              <View style={styles.dateRangeContainer}>
                <TouchableOpacity
                  style={[styles.datePickerButton, styles.dateRangeButton]}
                  onPress={() => setShowFromDatePicker(true)}
                >
                  <Calendar size={18} color="#8E8E93" style={styles.dateIcon} />
                  <Text style={localFilters.dateFrom ? styles.selectedValue : styles.placeholderText}>
                    {formatDate(localFilters.dateFrom)}
                  </Text>
                </TouchableOpacity>
                
                <Text style={styles.dateRangeSeparator}>to</Text>
                
                <TouchableOpacity
                  style={[styles.datePickerButton, styles.dateRangeButton]}
                  onPress={() => setShowToDatePicker(true)}
                >
                  <Calendar size={18} color="#8E8E93" style={styles.dateIcon} />
                  <Text style={localFilters.dateTo ? styles.selectedValue : styles.placeholderText}>
                    {formatDate(localFilters.dateTo)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Amount Range Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Amount Range</Text>
              <View style={styles.amountRangeContainer}>
                <View style={styles.amountInputWrapper}>
                  <Text style={styles.currencySymbol}>RWF</Text>
                  <TextInput
                    style={styles.amountInput}
                    placeholder="Min"
                    keyboardType="decimal-pad"
                    value={localFilters.minAmount}
                    onChangeText={(text) => setLocalFilters({...localFilters, minAmount: text})}
                  />
                </View>
                
                <Text style={styles.amountRangeSeparator}>to</Text>
                
                <View style={styles.amountInputWrapper}>
                  <Text style={styles.currencySymbol}>RWF</Text>
                  <TextInput
                    style={styles.amountInput}
                    placeholder="Max"
                    keyboardType="decimal-pad"
                    value={localFilters.maxAmount}
                    onChangeText={(text) => setLocalFilters({...localFilters, maxAmount: text})}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
          
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearFilters}
            >
              <Text style={styles.clearButtonText}>Clear Filters</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApplyFilters}
            >
              <Filter size={18} color="#FFFFFF" style={styles.applyButtonIcon} />
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
      
      <CategoryPicker
        visible={showCategoryPicker}
        onClose={() => setShowCategoryPicker(false)}
        onSelectCategory={(category) => {
          setLocalFilters({...localFilters, category});
          setShowCategoryPicker(false);
        }}
        selectedCategory={localFilters.category}
      />
      
      <DateTimePicker
        isVisible={showFromDatePicker}
        mode="date"
        onConfirm={(date) => {
          setLocalFilters({...localFilters, dateFrom: date});
          setShowFromDatePicker(false);
        }}
        onCancel={() => setShowFromDatePicker(false)}
        date={localFilters.dateFrom || new Date()}
      />
      
      <DateTimePicker
        isVisible={showToDatePicker}
        mode="date"
        onConfirm={(date) => {
          setLocalFilters({...localFilters, dateTo: date});
          setShowToDatePicker(false);
        }}
        onCancel={() => setShowToDatePicker(false)}
        date={localFilters.dateTo || new Date()}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    marginTop: 80,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  closeButton: {
    padding: 4,
  },
  filtersContainer: {
    flex: 1,
    padding: 16,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#3C3C43',
    marginBottom: 8,
  },
  pickerButton: {
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  selectedValue: {
    fontSize: 16,
    color: '#1C1C1E',
  },
  placeholderText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  dateRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  datePickerButton: {
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateRangeButton: {
    flex: 1,
  },
  dateRangeSeparator: {
    marginHorizontal: 8,
    color: '#8E8E93',
  },
  dateIcon: {
    marginRight: 8,
  },
  amountRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    paddingHorizontal: 12,
  },
  currencySymbol: {
    fontSize: 16,
    color: '#8E8E93',
    marginRight: 4,
  },
  amountInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#1C1C1E',
  },
  amountRangeSeparator: {
    marginHorizontal: 8,
    color: '#8E8E93',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8E8E93',
  },
  applyButton: {
    flex: 2,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButtonIcon: {
    marginRight: 8,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});