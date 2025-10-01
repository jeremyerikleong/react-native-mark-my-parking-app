import { COLORS } from '@/constants/theme';
import { Tabs } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.placeholderText,
        tabBarStyle: {
          backgroundColor: COLORS.secondary,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="parking"
        options={{
          title: "Parking",
          tabBarLabel: "Parking",
          tabBarIcon: ({ color, size }) => (
            <Icon name="car" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
