import { useEffect, useState } from "react";
import axios from "axios";

// Configure Axios to point at backend and send cookies
axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    name: "", author: "", github: "", description: "",
  });
  const [error, setError] = useState("");

  // Fetch all projects on mount
  useEffect(() => {
    axios.get("/api/auth/projects")
      .then(({ data }) => setProjects(data))
      .catch((err) => console.error("Fetch projects error:", err));
  }, []);

  const handleChange = (e) => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value });
  };

  const handleAddProject = async () => {
    setError("");
    const { name, author, github, description } = newProject;
    if (!name || !author || !github || !description) {
      setError("All fields are required.");
      return;
    }
    try {
      const { data } = await axios.post("/api/auth/projects", newProject);
      setProjects((prev) => [data, ...prev]);
      setNewProject({ name: "", author: "", github: "", description: "" });
    } catch (err) {
      console.error("Add project error:", err);
      setError(err.response?.data?.message || "Failed to add project");
    }
  };

  return (
  <div className="text-white space-y-8">
    <h2 className="text-3xl font-bold text-center">Top Projects</h2>

    {/* Project Cards First */}
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <div
          key={project._id}
          className="bg-gray-800 bg-opacity-90 p-6 rounded-xl shadow-lg hover:scale-[1.02] transition"
        >
          <h4 className="text-xl font-bold text-blue-400 mb-2">
            {project.name}
          </h4>
          <p className="text-gray-300 mb-2">By: {project.author}</p>
          <p className="text-gray-200 mb-4">{project.description}</p>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            GitHub Repo →
          </a>
        </div>
      ))}
    </div>

    {/* Add New Project Below */}
    <div className="bg-gray-800 bg-opacity-90 p-6 rounded-xl shadow-lg space-y-4">
      <h3 className="text-2xl font-semibold text-blue-300">Add New Project</h3>
      {error && <p className="text-red-400">{error}</p>}
      <div className="grid md:grid-cols-2 gap-4">
        <input
          name="name"
          placeholder="Project Name"
          className="p-3 rounded bg-gray-700 text-white placeholder-gray-400"
          value={newProject.name}
          onChange={handleChange}
        />
        <input
          name="author"
          placeholder="Author Name"
          className="p-3 rounded bg-gray-700 text-white placeholder-gray-400"
          value={newProject.author}
          onChange={handleChange}
        />
        <input
          name="github"
          placeholder="GitHub Link"
          className="p-3 rounded bg-gray-700 text-white placeholder-gray-400"
          value={newProject.github}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          rows="3"
          className="p-3 rounded bg-gray-700 text-white placeholder-gray-400 md:col-span-2"
          value={newProject.description}
          onChange={handleChange}
        />
      </div>
      <button
        onClick={handleAddProject}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold"
      >
        Add Project
      </button>
    </div>
  </div>
);

}
