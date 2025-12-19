import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task } from "./types";

const KEY = "tasks:v1";

export async function loadTasks(): Promise<Task[]> {
  const json = await AsyncStorage.getItem(KEY);
  if (!json) return [];
  try {
    const arr = JSON.parse(json) as Task[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export async function saveTasks(tasks: Task[]): Promise<void> {
  const json = JSON.stringify(tasks);
  await AsyncStorage.setItem(KEY, json);
}
