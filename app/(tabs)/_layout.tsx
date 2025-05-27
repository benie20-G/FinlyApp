import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { LayoutDashboard, Receipt, PlusCircle, Wallet, User } from 'lucide-react-native';
import Colors from '@/constants/Colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#34C759',
        tabBarInactiveTintColor: '#CCCCCC',
        tabBarStyle: {
          backgroundColor: '#181A20',
          borderTopWidth: 1,
          borderTopColor: '#23242A',
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 0,
          color: '#FFFFFF',
        },
        headerStyle: {
          backgroundColor: '#181A20',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 5,
        },
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
          color: '#FFFFFF',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <LayoutDashboard size={24} color={color} />,
          headerTitle: 'Financial Dashboard',
        }}
      />
      <Tabs.Screen
        name="expenses/index"
        options={{
          title: 'Expenses',
          tabBarIcon: ({ color }) => <Receipt size={24} color={color} />,
          headerTitle: 'Expenses',
        }}
      />
      <Tabs.Screen
        name="expenses/new"
        options={{
          title: 'Add',
          tabBarIcon: ({ color }) => <PlusCircle size={24} color={color} />,
          headerTitle: 'Add Expense',
        }}
      />
      <Tabs.Screen
        name="budgets/index"
        options={{
          title: 'Budgets',
          tabBarIcon: ({ color }) => <Wallet size={24} color={color} />,
          headerTitle: 'Budgets',
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
          headerTitle: 'Profile',
        }}
      />

      {/* 👇 Hidden screens */}
      <Tabs.Screen name="expenses/edit/[id]" options={{ href: null }} />
      <Tabs.Screen name="expenses/[id]" options={{ href: null }} />
    </Tabs>
  );
}