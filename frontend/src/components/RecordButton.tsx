import { startSpeechRecognition } from "../utils/speechToText";

export default function RecordButton({ onTranscript }: { onTranscript: (text: string) => void }) {
  return (
    <button
      onClick={() => startSpeechRecognition(onTranscript)}
      className="bg-red-500 text-white px-4 py-2 rounded mt-2"
    >
      Record Voice
    </button>
  );
}