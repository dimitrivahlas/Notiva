// ✅ Declare missing Web Speech API types
interface SpeechRecognition extends EventTarget {
    start(): void;
    stop(): void;
    abort(): void;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
    lang: string;
    continuous: boolean;
    interimResults: boolean;
  }
  
  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
  }
  
  interface SpeechRecognitionErrorEvent extends Event {
    error: string;
  }
  
  export function startSpeechRecognition(callback: (text: string) => void) {
    // ✅ Safely access SpeechRecognition API
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
    if (!SpeechRecognitionAPI) {
      alert("Your browser does not support speech recognition.");
      return;
    }
  
    const recognition: SpeechRecognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
  
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      callback(transcript);
    };
  
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event);
      alert("Speech recognition failed. Please try again.");
    };
  
    recognition.start();
  }
  