import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.tsx";
import NoteEditor from "./pages/NoteEditor.tsx";
import Navbar from "./components/Navbar.tsx";

export default function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/editor" element={<NoteEditor />} />
        <Route path="/editor/:id" element={<NoteEditor />} />
      </Routes>
    </div>
  );
}