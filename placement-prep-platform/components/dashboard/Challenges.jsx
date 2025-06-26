import { useEffect, useState } from "react";
import axios from "axios";

export default function Challenges() {
  const [todayChallenge, setTodayChallenge] = useState(null);
  const [previousChallenges, setPreviousChallenges] = useState([]);

  useEffect(() => {
    const fetchDailyChallenge = async () => {
      try {
        const res = await axios.get("/api/auth/dsa/daily");
        setTodayChallenge(res.data.today);
        setPreviousChallenges(res.data.previous);
      } catch (err) {
        console.error("Error fetching daily challenge:", err);
      }
    };

    fetchDailyChallenge();
  }, []);

  const getLeetCodeLink = (title) =>
    `https://leetcode.com/problems/${title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "")}`;

  return (
    <div className="text-white space-y-8">
      <h2 className="text-3xl font-bold text-center">Daily Coding Challenge</h2>

      {todayChallenge && (
        <div className="bg-gray-800 bg-opacity-90 p-6 rounded-xl shadow-lg">
          <h3 className="text-2xl font-semibold text-blue-300 mb-2">Today's Challenge</h3>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <p className="text-xl font-medium">{todayChallenge.question}</p>
            <a
              href={getLeetCodeLink(todayChallenge.question)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 md:mt-0 text-blue-400 hover:underline"
            >
              Solve on LeetCode →
            </a>
          </div>
        </div>
      )}

      {/* Previous Challenges */}
      <div className="bg-gray-800 bg-opacity-90 p-6 rounded-xl shadow-lg">
        <h3 className="text-2xl font-semibold text-blue-300 mb-4">Previous Challenges</h3>
        <ul className="space-y-4">
          {previousChallenges.map((challenge, idx) => (
            <li
              key={idx}
              className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-700 pb-2"
            >
              <div>
                <p className="text-lg">{challenge.question}</p>
                <span className="text-sm text-gray-400">{challenge.date}</span>
              </div>
              <a
                href={getLeetCodeLink(challenge.question)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline mt-1 md:mt-0"
              >
                Solve on LeetCode →
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
