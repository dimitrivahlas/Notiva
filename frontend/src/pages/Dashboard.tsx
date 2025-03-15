import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Note } from "../types/note";
import { apiRequest } from "../utils/api";
export default function Dashboard() {
  // Define state with proper type
  const [notes, setNotes] = useState<Note[]>([]);

  //Todo: add back in when connected to backend
  /* 
  useEffect(() => {
    apiRequeest("http://127.0.0.1:8000/notes").then((data: Note[]) => setNotes(data) || []));
  }, []);
  */


  const deleteNote = async (id: number) => {
    const response = await fetch(`http://127.0.0.1:8000/notes/${id}`, { method: "DELETE" });
    if (response.ok) {
      setNotes(notes.filter((note) => note.id !== id)); // Update UI after deleting
    }
  };
  

  //Fetch all notes when component mounts
  useEffect(() => {
    fetch("http://127.0.0.1:8000/notes")
      .then((res) => res.json())
      .then((data: Note[]) => setNotes(data)) // Specify expected response type
      .catch((error) => console.error("Error fetching notes:", error));
  }, []);

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
              <div key={note.id} className="p-4 bg-white rounded shadow hover:shadow-lg transition">
                <h3 className="font-bold text-lg text-blue-600">{note.title}</h3>
                <p className="text-gray-600 text-sm">{note.content.length > 100 ? note.content.substring(0, 100) + "..." : note.content}</p>
                <p className="text-xs text-gray-400 mt-2">Created on: {new Date().toLocaleDateString()}</p>
                <div className="mt-2 flex gap-2">
                  <Link to={`/editor/${note.id}`} className="bg-yellow-500 text-white px-2 py-1 rounded">
                    Edit
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
