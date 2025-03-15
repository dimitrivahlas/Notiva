import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Define a TypeScript interface for notes
interface Note {
  id: number;
  title: string;
  content: string;
}

export default function Dashboard() {
  // Define state with proper type
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/notes")
      .then((res) => res.json())
      .then((data: Note[]) => setNotes(data)) // Specify expected response type
      .catch((error) => console.error("Error fetching notes:", error));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Notes</h2>
      <Link to="/editor" className="px-4 py-2 bg-blue-500 text-white rounded">
        New Note
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {notes.length > 0 ? (
          notes.map((note) => (
            <div key={note.id} className="p-4 bg-white rounded shadow">
              <h3 className="font-bold">{note.title}</h3>
              <p>{note.content}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 mt-4">No notes available.</p>
        )}
      </div>
    </div>
  );
}
