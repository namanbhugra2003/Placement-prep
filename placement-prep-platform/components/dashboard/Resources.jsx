import { useEffect, useState } from "react";
import axios from "axios";

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [formData, setFormData] = useState({ title: "", link: "", description: "" });

  // Fetch all resources
  useEffect(() => {
    axios.get("/api/auth/resources")
      .then(res => setResources(res.data))
      .catch(err => console.error("Error fetching resources:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.link || !formData.description) return;

    try {
      const res = await axios.post("/api/auth/resources", formData);
      setResources([res.data, ...resources]);
      setFormData({ title: "", link: "", description: "" });
    } catch (err) {
      console.error("Error adding resource:", err);
    }
  };

 return (
  <div className="text-white space-y-8">
    <h2 className="text-3xl font-bold text-center">📚 Useful Resources</h2>

    {/* Resource List First */}
    <div className="bg-gray-800 bg-opacity-90 p-6 rounded-xl shadow-lg">
      <h3 className="text-2xl font-semibold text-blue-300 mb-4">🌐 Shared Resources</h3>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {resources.map((res, index) => (
          <div key={index} className="bg-gray-700 p-4 rounded-lg shadow-md border border-gray-600">
            <h4 className="text-lg font-bold text-blue-300 mb-2">{res.title}</h4>
            <p className="text-sm text-gray-300 mb-3">{res.description}</p>
            <a
              href={res.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Visit Resource →
            </a>
            {res.addedBy?.name && (
              <p className="text-xs text-gray-400 mt-2">— Added by {res.addedBy.name}</p>
            )}
          </div>
        ))}
      </div>
    </div>

    {/* Add Resource Form Second */}
    <div className="bg-gray-800 bg-opacity-90 p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-blue-300 mb-4">➕ Add a New Resource</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Resource Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400"
        />
        <input
          type="url"
          placeholder="Resource Link (https://...)"
          value={formData.link}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          className="w-full px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400"
        />
        <textarea
          placeholder="Short Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white font-semibold"
        >
          Add Resource
        </button>
      </form>
    </div>
  </div>
);

}
