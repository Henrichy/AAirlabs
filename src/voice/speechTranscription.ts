import Constants from "expo-constants";

export async function transcribeAudio(uri: string): Promise<string> {
  const provider = Constants.expoConfig?.extra?.TRANSCRIPTION_PROVIDER as string || "openai";

  // MOCK MODE
  if (provider === "mock") {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 1500));
    const mockPhrases = [
      "Buy milk and eggs",
      "Call mom tomorrow",
      "Finish the presentation and email the team",
      "Go to the gym at 6pm",
      "Book a flight to Paris"
    ];
    return mockPhrases[Math.floor(Math.random() * mockPhrases.length)];
  }

  const key = Constants.expoConfig?.extra?.OPENAI_API_KEY as string | undefined;
  if (!key) throw new Error("Missing API Key");

  let url = "https://api.openai.com/v1/audio/transcriptions";
  let model = "whisper-1";

  // GROQ SUPPORT
  if (provider === "groq") {
    url = "https://api.groq.com/openai/v1/audio/transcriptions";
    model = "whisper-large-v3";
  }

  const form = new FormData();
  // @ts-expect-error React Native FormData file type
  form.append("file", {
    uri,
    name: "recording.m4a",
    type: "audio/m4a"
  });
  form.append("model", model);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`
    },
    body: form
  });
  if (!res.ok) {
    const t = await res.text();
    try {
      const errorJson = JSON.parse(t);
      if (errorJson.error && errorJson.error.message) {
        throw new Error(errorJson.error.message);
      }
    } catch (e) {
      // If parsing fails or structure is different, fall through to throwing raw text
      if (e instanceof Error && e.message !== t && !t.includes(e.message)) {
         // It was a JSON parse error or property access error, ignore it
      } else if (e instanceof Error) {
        // It was the error we threw above
        throw e;
      }
    }
    throw new Error(`API Error (${res.status}): ${t}`);
  }
  const json = await res.json();
  return (json.text as string) ?? "";
}
