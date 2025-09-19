import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: true,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Upload",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="square.and.arrow.up" color={color} />
          ),
          headerTitle: "Upload Organoids",
        }}
      />
      <Tabs.Screen
        name="parameters"
        options={{
          title: "Parameters",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="gearshape.fill" color={color} />
          ),
          headerTitle: "Advanced Parameters",
        }}
      />
    </Tabs>
  );
}
