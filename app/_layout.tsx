import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { Stack } from "expo-router";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

import migrations from "../drizzle/migrations";
import { TaskProvider } from "../src/context/TaskContext";
import { db } from "../src/db/client";
import { Colors } from "../src/styles/colors";

export default function RootLayout() {
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    return (
      <View style={{ alignItems: "center", backgroundColor: Colors.background, flex: 1, justifyContent: "center", padding: 24 }}>
        <Text style={{ color: Colors.error, fontSize: 16, fontWeight: "700", textAlign: "center" }}>
          Veritabanı migration hatası
        </Text>
        <Text style={{ color: Colors.textSecondary, marginTop: 8, textAlign: "center" }}>
          {error.message}
        </Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View style={{ alignItems: "center", backgroundColor: Colors.background, flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color={Colors.oliveSoft} />
      </View>
    );
  }

  return (
    <TaskProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </TaskProvider>
  );
}
