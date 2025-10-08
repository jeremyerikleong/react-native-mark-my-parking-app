import BtnBack from '@/components/BtnBack';
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
          title: "Parking Buddy",
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
          headerShown: true,
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: COLORS.secondary,
          headerTitleAlign: 'center',
        }}
      />

      <Tabs.Screen
        name="parking"
        options={{
          title: "Parking Info",
          tabBarLabel: "Parking",
          tabBarIcon: ({ color, size }) => (
            <Icon name="car" color={color} size={size} />
          ),
          headerShown: true,
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: COLORS.secondary,
          headerTitleAlign: 'center',
          headerLeft: () => BtnBack(),
        }}
      />
    </Tabs>
  );
}
