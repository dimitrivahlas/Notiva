import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NoteEditor() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const saveNote = async () => {
    const response = await fetch("http://127.0.0.1:8000/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content })
    });

    if (response.ok) {
      navigate("/");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">New Note</h2>
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
        Save Note
      </button>
    </div>
  );
}
