import React, { createContext, useContext, useState, useMemo } from "react";
import { useColorScheme } from "react-native";

type ThemeColors = {
  background: string;
  text: string;
  card: string;
  border: string;
  primary: string;
  danger: string;
  secondaryText: string;
  inputBg: string;
};

const LightTheme: ThemeColors = {
  background: "#ffffff",
  text: "#000000",
  card: "#ffffff",
  border: "#dddddd",
  primary: "#1e88e5",
  danger: "#ef5350",
  secondaryText: "#555555",
  inputBg: "#fafafa"
};

const DarkTheme: ThemeColors = {
  background: "#121212",
  text: "#ffffff",
  card: "#1e1e1e",
  border: "#333333",
  primary: "#90caf9",
  danger: "#ef9a9a",
  secondaryText: "#aaaaaa",
  inputBg: "#2c2c2c"
};

type ThemeContextType = {
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemScheme === "dark");

  const colors = isDark ? DarkTheme : LightTheme;

  const toggleTheme = () => setIsDark((prev) => !prev);

  const value = useMemo(() => ({ isDark, colors, toggleTheme }), [isDark, colors]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
