import { Colors } from "@/styles/colors";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      {/* 🏠 Ana Ekran / Görevler */}
      <Tabs.Screen
        name="gorevler/index"
        options={{
          title: "Görevler",
          tabBarIcon: ({ color }) => (
            <Ionicons name="list-circle" size={26} color={color} />
          ),
        }}
      />

      {/* 📊 Analiz */}
      <Tabs.Screen
        name="analysis/index"
        options={{
          title: "Analiz",
          tabBarIcon: ({ color }) => (
            <Ionicons name="stats-chart" size={24} color={color} />
          ),
        }}
      />

      {/* 🔎 Raporlama */}
      <Tabs.Screen
        name="cancelled/index"
        options={{
          title: "Raporlama",
          tabBarIcon: ({ color }) => (
            <Ionicons name="search" size={23} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
