import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import NoteEditor from "./pages/NoteEditor";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/editor" element={<NoteEditor />} />
      </Routes>
    </div>
  );
}