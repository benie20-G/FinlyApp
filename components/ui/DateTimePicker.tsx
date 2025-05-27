import React from 'react';
import { View, StyleSheet, Platform, Modal, TouchableOpacity, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from '@/constants/Colors';

interface CustomDateTimePickerProps {
  isVisible: boolean;
  date: Date;
  mode: 'date' | 'time' | 'datetime';
  onConfirm: (date: Date) => void;
  onCancel: () => void;
}

export default function CustomDateTimePicker({
  isVisible,
  date,
  mode,
  onConfirm,
  onCancel,
}: CustomDateTimePickerProps) {
  const [localDate, setLocalDate] = React.useState(date);

  React.useEffect(() => {
    setLocalDate(date);
  }, [date]);

  const handleDateChange = (_: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      if (selectedDate) {
        setLocalDate(selectedDate);
        onConfirm(selectedDate);
      } else {
        onCancel();
      }
    } else {
      setLocalDate(selectedDate || date);
    }
  };

  if (Platform.OS === 'android') {
    if (!isVisible) return null;
    
    return (
      <DateTimePicker
        value={localDate}
        mode={mode}
        display="default"
        onChange={handleDateChange}
      />
    );
  }

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={isVisible}
      onRequestClose={onCancel}
    >
      <View style={styles.modalContainer}>
        <View style={styles.pickerContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onConfirm(localDate)}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>
          <DateTimePicker
            value={localDate}
            mode={mode}
            display="spinner"
            onChange={handleDateChange}
            style={styles.picker}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  cancelText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  doneText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  picker: {
    height: 200,
  },
});