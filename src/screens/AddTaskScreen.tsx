import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Platform } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import useTasks from "../state/useTasks";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "../state/ThemeContext";

type Props = NativeStackScreenProps<RootStackParamList, "AddTask">;

export default function AddTaskScreen({ navigation }: Props) {
  const { addTask } = useTasks();
  const { colors } = useTheme();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: colors.background },
      headerTintColor: colors.text,
      headerTitleStyle: { color: colors.text },
    });
  }, [navigation, colors]);

  const handleSave = () => {
    const t = title.trim();
    if (!t) {
      setError("Title is required");
      return;
    }
    addTask(t, description.trim() || undefined, dueDate?.getTime());
    navigation.goBack();
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.label, { color: colors.text }]}>Title</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
        value={title}
        onChangeText={setTitle}
        placeholder="Task title"
        placeholderTextColor={colors.secondaryText}
      />
      <Text style={[styles.label, { color: colors.text }]}>Description (optional)</Text>
      <TextInput
        style={[styles.input, styles.multiline, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }]}
        value={description}
        onChangeText={setDescription}
        placeholder="Description"
        placeholderTextColor={colors.secondaryText}
        multiline
      />

      <Text style={[styles.label, { color: colors.text }]}>Due Date (optional)</Text>
      <Pressable 
        style={[styles.dateButton, { backgroundColor: colors.inputBg, borderColor: colors.border }]} 
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={[styles.dateText, { color: colors.text }]}>
          {dueDate ? dueDate.toLocaleDateString() : "Select Date"}
        </Text>
      </Pressable>

      {showDatePicker && (
        <DateTimePicker
          value={dueDate || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChangeDate}
          minimumDate={new Date()}
          themeVariant={colors.background === "#121212" ? "dark" : "light"}
        />
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable style={[styles.saveButton, { backgroundColor: colors.primary }]} onPress={handleSave}>
        <Text style={styles.saveText}>Save</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { fontSize: 14, marginTop: 12 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16
  },
  multiline: { minHeight: 80, textAlignVertical: "top" },
  dateButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 4
  },
  dateText: { fontSize: 16 },
  error: { color: "#d32f2f", marginTop: 8 },
  saveButton: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center"
  },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "600" }
});
