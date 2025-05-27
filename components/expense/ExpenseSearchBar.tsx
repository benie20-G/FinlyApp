import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Search, X } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface ExpenseSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onClear: () => void;
}

export default function ExpenseSearchBar({
  searchQuery,
  setSearchQuery,
  onClear,
}: ExpenseSearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Search size={18} color="#8E8E93" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Search expenses..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          returnKeyType="search"
        />
        {searchQuery ? (
          <TouchableOpacity onPress={onClear} style={styles.clearButton}>
            <X size={18} color="#8E8E93" />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#1C1C1E',
  },
  clearButton: {
    padding: 4,
  },
});