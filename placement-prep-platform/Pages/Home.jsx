import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
axios.withCredentials=true;
export default function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null = loading

  useEffect(() => {
    axios
      .get("/api/auth/check-auth", { withCredentials: true })
      .then((res) => {
        setIsLoggedIn(res.data.isLoggedIn);
      })
      .catch(() => {
        setIsLoggedIn(false);
      });
  }, []);

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/register");
    }
  };

  return (
    <div
      className="bg-cover bg-center min-h-screen text-white"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1950&q=80')",
      }}
    >
      <div className="bg-black bg-opacity-70 min-h-screen px-6 py-12 flex flex-col items-center justify-center space-y-12">
        <div className="text-center space-y-6 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Prepare Smarter, Get Placed Faster
          </h1>
          <p className="text-lg md:text-xl">
            Your one-stop platform for placement preparation
          </p>
          <button
            onClick={handleGetStarted}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white inline-block"
            disabled={isLoggedIn === null} // Disable while checking
          >
            Get Started
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl w-full mt-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white bg-opacity-10 backdrop-blur-md p-6 rounded-xl shadow-md text-left hover:bg-opacity-20 transition"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-200">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    icon: "✅",
    title: "Track Progress",
    description: "Stay on top of your DSA, projects, and resume progress.",
  },
  {
    icon: "📅",
    title: "Daily Challenges",
    description: "Practice daily with curated or custom coding challenges.",
  },
  {
    icon: "📚",
    title: "Resource Library",
    description: "Access and share links, videos, and tips for placement.",
  },
  {
    icon: "📝",
    title: "Interview Experiences",
    description: "Read and write real-world interview experiences from peers.",
  },
  {
    icon: "🔖",
    title: "Bookmark Items",
    description: "Save challenges, resources, or experiences for later use.",
  },
  {
    icon: "⚙️",
    title: "Admin Tools (Optional)",
    description: "Moderate content and add daily challenges as admin.",
  },
];
