import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

// Function to create a consistent tab bar icon
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

// Main Tab Layout Component
export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#B7E561', // Green for active icon
        tabBarInactiveTintColor: '#FFF', // White for inactive icons
        tabBarStyle: {
          backgroundColor: '#000', // Black background for footer
          borderTopColor: '#333', // Slight border for separation
          height: 70, // Height adjustment for better visibility
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5, // Position the labels slightly above the footer edge
        },
        headerShown: false,
      }}
    >
      {/* Home Screen */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />

      {/* Database Screen */}
      <Tabs.Screen
        name="two"
        options={{
          title: 'Reports',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="storage" size={24} color={color} />
          ),
        }}
      />

      {/* Storage Screen */}
      <Tabs.Screen
        name="three"
        options={{
          title: 'Upload',
          tabBarIcon: ({ color }) => (
            <Ionicons name="cloud" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
