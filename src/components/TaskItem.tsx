import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Task } from "../state/types";
import { useTheme } from "../state/ThemeContext";

type Props = {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
};

export default function TaskItem({ task, onToggle, onDelete }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      <Pressable 
        onPress={onToggle} 
        style={[
          styles.checkbox, 
          { borderColor: colors.primary },
          task.completed && { backgroundColor: colors.primary }
        ]}
      >
        {task.completed ? <Text style={styles.checkmark}>✓</Text> : null}
      </Pressable>
      <View style={styles.texts}>
        <Text style={[styles.title, { color: colors.text }, task.completed && styles.completed]} numberOfLines={1}>
          {task.title}
        </Text>
        {task.description ? (
          <Text style={[styles.desc, { color: colors.secondaryText }, task.completed && styles.completed]} numberOfLines={2}>
            {task.description}
          </Text>
        ) : null}
        {task.dueDate ? (
          <Text style={styles.date}>Due: {new Date(task.dueDate).toLocaleDateString()}</Text>
        ) : null}
      </View>
      <Pressable onPress={onDelete} style={[styles.delete, { backgroundColor: colors.danger }]}>
        <Text style={styles.deleteText}>Delete</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12
  },
  checkmark: { color: "#fff", fontWeight: "700" },
  texts: { flex: 1 },
  title: { fontSize: 16, fontWeight: "600" },
  desc: { fontSize: 14, marginTop: 2 },
  date: { fontSize: 12, color: "#888", marginTop: 2, fontStyle: "italic" },
  completed: { textDecorationLine: "line-through", opacity: 0.5 },
  delete: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6
  },
  deleteText: { color: "#fff", fontWeight: "600" }
});
