import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <h1 className="text-xl font-bold">Notiva</h1>
      <div>
        <Link to="/" className="px-4">Dashboard</Link>
        <Link to="/editor" className="px-4">New Note</Link>
      </div>
    </nav>
  );
}
