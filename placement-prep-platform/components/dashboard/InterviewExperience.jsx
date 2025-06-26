import { useEffect, useState } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;

export default function InterviewExperience() {
  const [experiences, setExperiences] = useState([]);
  const [formData, setFormData] = useState({
    company: "",
    candidate: "",
    description: "",
  });
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    axios.get("/api/auth/interviews")
      .then(res => setExperiences(res.data))
      .catch(err => console.error("Error fetching experiences:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { company, candidate, description } = formData;
    if (!company || !candidate || !description) return;

    try {
      const res = await axios.post("/api/auth/interviews", formData);
      setExperiences([res.data, ...experiences]);
      setFormData({ company: "", candidate: "", description: "" });
    } catch (err) {
      console.error("Error submitting experience:", err);
    }
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

 return (
  <div className="text-white space-y-8">
    <h2 className="text-3xl font-bold text-center">📋 Interview Experiences</h2>

    {/* Shared Experiences FIRST */}
    <div className="bg-gray-800 bg-opacity-90 p-6 rounded-xl shadow-lg">
      <h3 className="text-2xl font-semibold text-blue-300 mb-4">🧠 Shared Experiences</h3>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {experiences.map((exp, index) => {
          const isExpanded = expandedIndex === index;
          const shouldTruncate = exp.description.length > 150;
          const displayText = isExpanded
            ? exp.description
            : shouldTruncate
            ? exp.description.slice(0, 150) + "..."
            : exp.description;

          return (
            <div
              key={exp._id}
              className="bg-gray-700 p-4 rounded-lg shadow-md border border-gray-600 break-words max-h-64 overflow-auto"
            >
              <h4 className="text-lg font-bold text-blue-300 mb-1">
                {exp.company} - {exp.candidate}
              </h4>
              <p className="text-sm text-gray-300 whitespace-pre-wrap">
                {displayText}
              </p>
              {shouldTruncate && (
                <button
                  onClick={() => toggleExpand(index)}
                  className="mt-2 text-blue-400 hover:underline focus:outline-none"
                >
                  {isExpanded ? "Read Less" : "Read More"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>

    {/* Add Experience BELOW */}
    <div className="bg-gray-800 bg-opacity-90 p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-blue-300 mb-4">➕ Add Interview Experience</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Company Name"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          className="w-full px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Candidate Name"
          value={formData.candidate}
          onChange={(e) => setFormData({ ...formData, candidate: e.target.value })}
          className="w-full px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          placeholder="Interview Experience"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white font-semibold"
        >
          Add Experience
        </button>
      </form>
    </div>
  </div>
);
}