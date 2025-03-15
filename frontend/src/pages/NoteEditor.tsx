import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Note } from "../types/note";

export default function NoteEditor() {
  const { id } = useParams(); // Get note ID from URL parameters for edit mode
  const navigate = useNavigate();

  //state management for form fields
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  //Load existing note data when editing when id is present
  useEffect(() => {
    if (id) {
      fetch(`http://127.0.0.1:8000/notes/${id}`)
        .then((res) => res.json())
        .then((data: Note) => {
          setTitle(data.title);
          setContent(data.content);
        })
        .catch((error) => console.error("Error fetching note:", error));
    }
  }, [id]);

  //handle Note Creation and update
  const saveNote = async () => {
    try {
      const method = id ? "PUT" : "POST";
      let url = id ? `http://127.0.0.1:8000/notes/${id}` : "http://127.0.0.1:8000/notes";
      
      // For POST requests, append query parameters
      if (!id) {
        url += `?title=${encodeURIComponent(title)}&content=${encodeURIComponent(content)}`;
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        // Only include body for PUT requests
        ...(id && { body: JSON.stringify({ title, content }) }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Note saved:', data);
      navigate("/"); // Navigate back to dashboard after saving
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Failed to save note. Please try again.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{id ? "Edit Note" : "New Note"}</h2>
      <input
        type="text"
        placeholder="Title"
        className="border p-2 w-full mb-2 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Write your note here..."
        className="border p-2 w-full mb-2 rounded"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button onClick={saveNote} className="bg-blue-500 text-white px-4 py-2 rounded">
        {id ? "Update Note" : "Save Note"}
      </button>
    </div>
  );
}
