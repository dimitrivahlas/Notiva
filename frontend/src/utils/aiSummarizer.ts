import { pipeline } from "@xenova/transformers";

// ✅ Load the AI model once and reuse it for efficiency
let summarizer: any = null;

export async function summarizeText(text: string): Promise<string> {
  try {
    if (!summarizer) {
      summarizer = await pipeline("summarization", "Xenova/bart-large-cnn");
    }

    const result = await summarizer(text, { max_length: 50, min_length: 20, do_sample: false });
    return result[0].summary_text;
  } catch (error) {
    console.error("AI Summarization Failed:", error);
    return "Summary unavailable.";
  }
}