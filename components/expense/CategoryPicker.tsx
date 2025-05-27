import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { X } from 'lucide-react-native';

interface CategoryPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
}

const categories = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Housing',
  'Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Personal',
  'Other',
];

export default function CategoryPicker({
  visible,
  onClose,
  onSelectCategory,
  selectedCategory,
}: CategoryPickerProps) {
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
            <Text style={styles.title}>Select Category</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#8E8E93" />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={categories}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.categoryItem,
                  selectedCategory === item && styles.selectedItem,
                ]}
                onPress={() => onSelectCategory(item)}
              >
                <View 
                  style={[
                    styles.categoryDot, 
                    { backgroundColor: getCategoryColor(item) }
                  ]} 
                />
                <Text 
                  style={[
                    styles.categoryText,
                    selectedCategory === item && styles.selectedText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.listContainer}
          />
        </SafeAreaView>
      </View>
    </Modal>
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
    Personal: '#BF5AF2',
    Other: '#64D2FF',
  };
  
  return categoryColors[category] || '#64D2FF';
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    marginTop: 100,
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
  listContainer: {
    padding: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  selectedItem: {
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 0,
  },
  categoryDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  categoryText: {
    fontSize: 16,
    color: '#1C1C1E',
  },
  selectedText: {
    fontWeight: '600',
  },
});