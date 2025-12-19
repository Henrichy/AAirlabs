require('dotenv').config();

module.exports = () => ({
  expo: {
    name: "ToDo Voice",
    slug: "todo-voice",
    version: "1.0.0",
    sdkVersion: "51.0.0",
    platforms: ["ios", "android", "web"],
    orientation: "portrait",
    updates: { fallbackToCacheTimeout: 0 },
    assetBundlePatterns: ["**/*"],
    ios: { supportsTablet: true },
    android: { adaptiveIcon: { backgroundColor: "#ffffff" } },
    web: { bundler: "metro", favicon: "" },
    extra: {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
      TRANSCRIPTION_PROVIDER: process.env.TRANSCRIPTION_PROVIDER || "openai"
    }
  }
});
