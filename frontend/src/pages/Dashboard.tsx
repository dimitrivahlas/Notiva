import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Note } from "../types/note";
import { apiRequest } from "../utils/api";
import { summarizeText } from "../utils/aiSummarizer";

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [summaries, setSummaries] = useState<{ [key: number]: string }>({});
  const [error, setError] = useState<string | null>(null);

  const deleteNote = async (id: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/notes/${id}`, { method: "DELETE" });
      if (response.ok) {
        setNotes(notes.filter((note) => note.id !== id));
      } else {
        throw new Error(`Failed to delete note: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete note");
    }
  };

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/notes/");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setNotes(data);

        // Generate summaries
        const summaryMap: { [key: number]: string } = {};
        for (const note of data) {
          if (note.content) {
            try {
              summaryMap[note.id] = await summarizeText(note.content);
            } catch (err) {
              console.error(`Failed to summarize note ${note.id}:`, err);
              summaryMap[note.id] = note.content.split(/[.!?]+/)[0];
            }
          } else {
            summaryMap[note.id] = "Empty note";
          }
        }
        setSummaries(summaryMap);
      } catch (error) {
        console.error("Error fetching notes:", error);
        setError("Failed to load notes");
      }
    };

    fetchNotes();
  }, []);

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
          {notes.length > 0 ? (
            notes.map((note) => (
              <div key={note.id} className="p-4 bg-white rounded shadow">
                <h3 className="font-bold text-lg text-blue-600">{note.title}</h3>
                <p className="text-gray-600 text-sm mt-2">
                  {summaries[note.id] || "Generating AI summary..."}
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