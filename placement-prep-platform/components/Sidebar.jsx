import { useNavigate } from "react-router-dom";

export default function Sidebar({ setSelected, selected }) {
  const navigate = useNavigate();

  const sections = [
    "DSA",
    "Projects",
    "Resume",
    "Challenges",
    "Resources",
    "VideoLectures",
    "Interview Experience",
  ];

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      navigate("/login"); // Redirect to login
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <aside className="h-screen bg-black bg-opacity-90 text-white p-4 shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <ul className="space-y-3">
        {sections.map((item) => (
          <li
            key={item}
            onClick={() => setSelected(item)}
            className={`cursor-pointer px-4 py-2 rounded hover:bg-blue-600 ${
              selected === item ? "bg-blue-700" : ""
            }`}
          >
            {item}
          </li>
        ))}
        <li
          onClick={handleLogout}
          className="cursor-pointer px-4 py-2 rounded hover:bg-red-600 bg-red-700 mt-6 font-semibold text-center"
        >
          Logout
        </li>
      </ul>
    </aside>
  );
}
