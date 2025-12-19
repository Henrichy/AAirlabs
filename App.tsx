import React from "react";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/navigation/AppNavigator";
import { TasksProvider } from "./src/state/TasksContext";
import { ThemeProvider, useTheme } from "./src/state/ThemeContext";

function MainLayout() {
  const { isDark, colors } = useTheme();

  const navigationTheme = {
    dark: isDark,
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      primary: colors.primary,
      background: colors.background,
      card: colors.background, // Match header to background
      text: colors.text,
      border: colors.border,
      notification: colors.danger,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <AppNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <TasksProvider>
          <MainLayout />
        </TasksProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
