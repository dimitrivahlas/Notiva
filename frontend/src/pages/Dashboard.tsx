import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Note } from "../types/note";
import { apiRequest } from "../utils/api";
import { summarizeText } from "../utils/aiSummarizer";

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [summaries, setSummaries] = useState<{ [key: number]: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  const generateSummary = async (note: Note) => {
    if (!note.content) return "Empty note";
    try {
      const summary = await summarizeText(note.content);
      setSummaries(prev => ({ ...prev, [note.id]: summary }));
    } catch (err) {
      console.error(`Failed to summarize note ${note.id}:`, err);
      const fallback = note.content.split(/[.!?]+/)[0];
      setSummaries(prev => ({ ...prev, [note.id]: fallback }));
    }
  };

  const deleteNote = async (id: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/notes/${id}`, { method: "DELETE" });
      if (response.ok) {
        setNotes(notes.filter((note) => note.id !== id));
        setSummaries(prev => {
          const newSummaries = { ...prev };
          delete newSummaries[id];
          return newSummaries;
        });
      } else {
        throw new Error(`Failed to delete note: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete note");
    }
  };

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://127.0.0.1:8000/notes/");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setNotes(data);

      // Generate summaries asynchronously
      data.forEach((note: Note) => {
        generateSummary(note);
      });
    } catch (error) {
      console.error("Error fetching notes:", error);
      setError("Failed to load notes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [location.key]); // Refetch when location changes (i.e., after navigation)

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Your Notes</h2>
        <Link to="/editor" className="px-4 py-2 bg-blue-500 text-white rounded">
          New Note
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {isLoading ? (
            <div className="col-span-2 text-center py-4">
              <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : notes.length > 0 ? (
            notes.map((note) => (
              <div key={note.id} className="p-4 bg-white rounded shadow">
                <h3 className="font-bold text-lg text-blue-600">{note.title}</h3>
                <p className="text-gray-600 text-sm mt-2">
                  {summaries[note.id] || 
                    <span className="inline-flex items-center">
                      Generating AI summary...
                      <svg className="animate-spin ml-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                  }
                </p>
                <div className="mt-2 flex gap-2">
                  <Link to={`/editor/${note.id}`} className="bg-green-500 text-white px-2 py-1 rounded">
                    View
                  </Link>
                  <button onClick={() => deleteNote(note.id)} className="bg-red-500 text-white px-2 py-1 rounded">
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 mt-4">No notes available.</p>
          )}
        </div>
      </div>
    </div>
  );
}