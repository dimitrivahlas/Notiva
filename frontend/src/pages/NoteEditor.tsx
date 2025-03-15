import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Note {
  id: number;
  title: string;
  content: string;
}

export default function NoteEditor() {
  const { id } = useParams(); // Get note ID from URL
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

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

  const saveNote = async () => {
    const method = id ? "PUT" : "POST";
    const url = id ? `http://127.0.0.1:8000/notes/${id}` : "http://127.0.0.1:8000/notes";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    if (response.ok) {
      navigate("/");
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
