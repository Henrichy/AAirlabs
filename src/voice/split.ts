export function splitIntoTasks(input: string): string[] {
  const text = input.trim();
  if (!text) return [];
  
  // Clean up common transcription artifacts like trailing periods
  const cleanText = text.replace(/[.]+$/, "");
  
  const lowered = cleanText.toLowerCase();
  // Expanded delimiters for better splitting
  const delimiters = [
    " and also ", " and then ", " followed by ",
    " and ", " then ", " also ", " plus ",
    ";", " & ", ",", ".",
    "\n" // Split on new lines
  ];
  
  // Use a more robust splitting strategy
  // We need to preserve the order and handle mixed delimiters
  // Simplest approach: normalize all delimiters to a single one, then split
  
  let tempText = cleanText;
  
  for (const d of delimiters) {
    // Escape regex special characters if needed
    const escaped = d.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(escaped, "gi");
    tempText = tempText.replace(pattern, " |SPLIT| ");
  }
  
  return tempText
    .split("|SPLIT|")
    .map((p) => p
      .replace(/^\d+\.\s*/, "") // Remove numbering "1. "
      .replace(/^-\s*/, "")     // Remove bullets "- "
      .trim()
    )
    .filter(p => p.length > 1); // Filter out single characters or empty strings
}
