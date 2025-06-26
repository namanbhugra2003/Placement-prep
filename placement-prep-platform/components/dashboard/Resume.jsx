// src/components/dashboard/Resume.jsx
import { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

export default function Resume() {
  const [allResumes, setAllResumes] = useState([]);
  const [myResume, setMyResume] = useState(null);
  const [form, setForm] = useState({ name: "", file: "" });
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");

  // Fetch all resumes on mount
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const { data } = await axios.get("/api/auth/resumes");
        setAllResumes(data);
        // Find this user's resume
        const me = data.find((r) => r.isMine);
        if (me) {
          setMyResume(me);
          setForm({ name: me.name, file: me.file });
        }
      } catch (err) {
        console.error("Fetch resumes error:", err);
      }
    };
    fetchResumes();
  }, []);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    setError("");
    const { name, file } = form;
    if (!name || !file) {
      setError("Both name and file URL are required.");
      return;
    }

    try {
      let res;
      if (myResume) {
        // Update existing
        res = await axios.put(`/api/auth/resumes/${myResume._id}`, form);
      } else {
        // Create new
        res = await axios.post("/api/auth/resumes", form);
      }
      // Refresh list
      const updated = await axios.get("/api/auth/resumes");
      setAllResumes(updated.data);
      const me = updated.data.find((r) => r.isMine);
      setMyResume(me);
      setForm({ name: me.name, file: me.file });
      setEditing(false);
    } catch (err) {
      console.error("Save resume error:", err);
      setError(err.response?.data?.message || "Failed to save");
    }
  };

  // Others = all minus mine
  const others = allResumes.filter((r) => !r.isMine);

  return (
    <div className="text-white space-y-8">
      <h2 className="text-3xl font-bold text-center">Resume Submissions</h2>

      {/* Your Resume Section */}
      <div className="bg-gray-800 bg-opacity-90 p-6 rounded-xl shadow-lg">
        <h3 className="text-2xl font-semibold text-blue-300 mb-4">
          {myResume ? "Your Resume" : "Upload Your Resume"}
        </h3>

        {error && <p className="text-red-400 mb-2">{error}</p>}

        {(!myResume || editing) ? (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <input
                name="name"
                placeholder="Your Name"
                className="p-3 rounded bg-gray-700 text-white"
                value={form.name}
                onChange={handleChange}
              />
              <input
                name="file"
                placeholder="Resume Link (PDF)"
                className="p-3 rounded bg-gray-700 text-white"
                value={form.file}
                onChange={handleChange}
              />
            </div>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold"
            >
              {myResume ? "Save Changes" : "Upload Resume"}
            </button>
            {myResume && (
              <button
                onClick={() => {
                  setEditing(false);
                  setForm({ name: myResume.name, file: myResume.file });
                }}
                className="ml-4 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white"
              >
                Cancel
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xl font-medium">{myResume.name}</p>
            <a
              href={myResume.file}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              View Resume →
            </a>
            <button
              onClick={() => setEditing(true)}
              className="mt-4 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded text-white"
            >
              Edit
            </button>
          </div>
        )}
      </div>

      {/* Others' Resumes */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-blue-300">Others' Resumes</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {others.map((r) => (
            <div
              key={r._id}
              className="bg-gray-800 bg-opacity-90 p-6 rounded-xl shadow-lg hover:scale-[1.02] transition"
            >
              <p className="text-xl font-bold text-blue-400 mb-2">{r.name}</p>
              <a
                href={r.file}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View Resume →
              </a>
            </div>
          ))}
          {others.length === 0 && <p>No one else has uploaded yet.</p>}
        </div>
      </div>
    </div>
  );
}
