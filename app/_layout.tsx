import { Stack } from "expo-router";
import React from "react";
import { TaskProvider } from "../src/context/TaskContext";

export default function RootLayout() {
  return (
    <TaskProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </TaskProvider>
  );
}
