import { useEffect, useState } from "react";
import axios from "axios";

export default function VideoLectures() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    axios
      .get("/api/auth/videos") // adjust path if needed
      .then((res) => setVideos(res.data))
      .catch((err) => console.error("Failed to load videos:", err));
  }, []);

  return (
    <div className="text-white space-y-8">
      <h2 className="text-3xl font-bold text-center">🎥 Video Lectures</h2>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video, index) => (
          <div
            key={index}
            className="bg-gray-800 bg-opacity-90 p-4 rounded-xl shadow-md"
          >
            <h4 className="text-lg font-bold text-blue-400 mb-2">
              {video.title}
            </h4>
            <p className="text-sm text-gray-300 mb-2">{video.category}</p>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={video.link}
                title={video.title}
                allowFullScreen
                className="w-full h-52 rounded-lg"
              ></iframe>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
