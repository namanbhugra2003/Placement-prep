import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import DSA from "../components/dashboard/DSA";
import Projects from "../components/dashboard/Projects";
import Resume from "../components/dashboard/Resume";
import Challenges from "../components/dashboard/Challenges";
import Resources from "../components/dashboard/Resources";
import InterviewExperience from "../components/dashboard/InterviewExperience";
import VideoLectures from "../components/dashboard/VideoLectures";
import dashboardBg from "../src/dashboardbg.jpg";

export default function Dashboard() {
  const [selected, setSelected] = useState("DSA");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        await axios.get("http://localhost:5000/api/auth/me", {
          withCredentials: true,
        });
      } catch (err) {
        console.error("User not authenticated:", err);
        navigate("/login");
      }
    };

    verifyUser();
  }, []);

  const renderSection = () => {
    switch (selected) {
      case "DSA":
        return <DSA />;
      case "Projects":
        return <Projects />;
      case "Resume":
        return <Resume />;
      case "Challenges":
        return <Challenges />;
      case "Resources":
        return <Resources />;
      case "VideoLectures":
        return <VideoLectures />;
      case "Interview Experience":
        return <InterviewExperience />;
      default:
        return <DSA />;
    }
  };

  return (
    <div
      className="min-h-screen w-full flex bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${dashboardBg})`,
        backgroundColor: "#1a202c",
      }}
    >
      {/* Sidebar */}
      <aside className="w-64 fixed top-0 left-0 h-full z-20">
        <Sidebar selected={selected} setSelected={setSelected} />
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-6 bg-black bg-opacity-70 text-white min-h-screen overflow-y-auto">
        {renderSection()}
      </main>
    </div>
  );
}
