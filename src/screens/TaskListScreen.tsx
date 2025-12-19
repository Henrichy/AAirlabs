import React, { useEffect, useMemo, useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, TextInput, LayoutAnimation, Platform, UIManager } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import TaskItem from "../components/TaskItem";
import useTasks from "../state/useTasks";
import VoiceFab from "../voice/VoiceFab";
import { useTheme } from "../state/ThemeContext";

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

type Props = NativeStackScreenProps<RootStackParamList, "TaskList">;

export default function TaskListScreen({ navigation }: Props) {
  const { tasks, toggleTask, deleteTask, loadTasks, addTasks } = useTasks();
  const { colors, toggleTheme, isDark } = useTheme();
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadTasks();
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={toggleTheme} style={{ padding: 8 }}>
          <Text style={{ fontSize: 24 }}>{isDark ? "☀️" : "🌙"}</Text>
        </Pressable>
      ),
      headerStyle: { backgroundColor: colors.background },
      headerTintColor: colors.text,
      headerTitleStyle: { color: colors.text }
    });
  }, [loadTasks, navigation, toggleTheme, isDark, colors]);

  const handleDelete = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    deleteTask(id);
  };

  const handleToggle = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    toggleTask(id);
  };
  
  const handleAddTasks = (text: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    addTasks(text);
  };

  const filteredTasks = useMemo(() => {
    let result = [...tasks];
    
    // Filter by search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(q) || 
        t.description?.toLowerCase().includes(q)
      );
    }
    
    // Sort: Incomplete first, then by due date (earliest first), then by creation date
    return result.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      
      if (a.dueDate && b.dueDate) return a.dueDate - b.dueDate;
      if (a.dueDate) return -1; // Tasks with due date come first
      if (b.dueDate) return 1;
      
      return b.createdAt - a.createdAt; // Newest first for rest
    });
  }, [tasks, search]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>To-Do</Text>
        <Pressable style={[styles.addButton, { backgroundColor: colors.primary }]} onPress={() => navigation.navigate("AddTask")}>
          <Text style={styles.addButtonText}>+</Text>
        </Pressable>
      </View>
      
      <View style={styles.searchContainer}>
        <TextInput 
          style={[styles.searchInput, { backgroundColor: colors.inputBg, color: colors.text }]}
          placeholder="Search tasks..."
          placeholderTextColor={colors.secondaryText}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {filteredTasks.length === 0 ? (
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: colors.secondaryText }]}>No tasks found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onToggle={() => handleToggle(item.id)}
              onDelete={() => handleDelete(item.id)}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
        />
      )}
      <VoiceFab onTranscribed={handleAddTasks} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8
  },
  searchInput: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16
  },
  title: { fontSize: 24, fontWeight: "600" },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1e88e5",
    alignItems: "center",
    justifyContent: "center"
  },
  addButtonText: { color: "#fff", fontSize: 24, lineHeight: 24 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: { color: "#777" },
  sep: { height: 8 }
});
