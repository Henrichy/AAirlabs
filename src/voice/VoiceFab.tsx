import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { transcribeAudio } from "./speechTranscription";

type Props = {
  onTranscribed: (text: string) => void;
};

export default function VoiceFab({ onTranscribed }: Props) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [busy, setBusy] = useState(false);
  const recRef = useRef<Audio.Recording | null>(null);

  useEffect(() => {
    Audio.requestPermissionsAsync();
  }, []);

  const start = async () => {
    if (busy || recording) return;
    try {
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await rec.startAsync();
      recRef.current = rec;
      setRecording(rec);
    } catch (e: any) {
      console.error("Start recording error:", e);
      alert("Could not start recording: " + e.message);
    }
  };

  const stop = async () => {
    const rec = recRef.current;
    if (!rec) return;
    setBusy(true);
    try {
      await rec.stopAndUnloadAsync();
      const uri = rec.getURI();
      setRecording(null);
      if (uri) {
        const info = await FileSystem.getInfoAsync(uri);
        if (!info.exists) throw new Error("No file");
        const text = await transcribeAudio(uri);
        onTranscribed(text);
      }
    } catch (e: any) {
      console.error("Transcription error:", e);
      alert("Error: " + e.message);
    } finally {
      setBusy(false);
    }
  };

  const toggle = () => {
    if (recording) stop();
    else start();
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={toggle}
        style={[styles.fab, recording ? styles.rec : busy ? styles.busy : styles.idle]}
      >
        <Text style={styles.fabText}>{recording ? "Stop" : busy ? "..." : "Voice"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { position: "absolute", bottom: 24, right: 24 },
  fab: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2
  },
  idle: { backgroundColor: "#43a047" },
  rec: { backgroundColor: "#e53935" },
  busy: { backgroundColor: "#fb8c00" },
  fabText: { color: "#fff", fontWeight: "700" }
});
