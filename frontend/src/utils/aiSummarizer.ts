import { pipeline, env } from "@xenova/transformers";

// Configure the environment
env.allowLocalModels = false;
env.backends.onnx.wasm.numThreads = 1;

let summarizer: any = null;

export async function summarizeText(text: string): Promise<string> {
  try {
    if (!text.trim()) {
      return "Empty note";
    }

    if (!summarizer) {
      console.log("Loading summarization model...");
      summarizer = await pipeline(
        "summarization",
        "Xenova/t5-small",
        { quantized: true }
      );
      console.log("Model loaded successfully");
    }

    const cleanText = text.trim().slice(0, 1000);
    console.log("Starting summarization with text:", cleanText);
    
    const result = await summarizer(cleanText, {
      max_length: 60,
      min_length: 10,
      do_sample: false
    });
    
    console.log("Summarization result:", result);
    if (!result?.[0]?.summary_text) {
      throw new Error("No summary generated");
    }
    return result[0].summary_text;
  } catch (error) {
    console.error("Summarization failed:", error);
    // Fallback to first sentence if AI fails
    const firstSentence = text.split(/[.!?]+/)[0];
    return firstSentence.length > 100 ? firstSentence.slice(0, 100) + "..." : firstSentence;
  }
}