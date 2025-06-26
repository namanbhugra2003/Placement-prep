// src/components/dashboard/DSA.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer,
} from "recharts";

// Ensure requests include your auth cookie
axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

const COLORS = ["#34D399", "#FBBF24", "#EF4444"];

export default function DSA() {
  const [unsolved, setUnsolved] = useState([]);
  const [solved, setSolved] = useState([]);
  const [showAllUnsolved, setShowAllUnsolved] = useState(false);
  const [showAllSolved, setShowAllSolved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/auth/dsa")
      .then(({ data }) => {
        setSolved(data.solved);
        setUnsolved(data.unsolved);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const markSolved = (q) => {
    axios.post("/api/auth/dsa/solve", { question: q })
      .then(({ data }) => {
        setSolved(data.solved);
        setUnsolved(data.unsolved);
      })
      .catch(console.error);
  };

  const markUnsolve = (q) => {
    axios.post("/api/auth/dsa/unsolve", { question: q })
      .then(({ data }) => {
        setSolved(data.solved);
        setUnsolved(data.unsolved);
      })
      .catch(console.error);
  };

  if (loading) return <p className="text-white">Loading DSA progress...</p>;

  const pieData = [
    { name: "Solved", value: solved.length },
    { name: "Unsolved", value: unsolved.length },
  ];

  const displayedUnsolved = showAllUnsolved ? unsolved : unsolved.slice(0, 10);
  const displayedSolved   = showAllSolved   ? solved   : solved.slice(0, 10);

  return (
    <div className="text-white space-y-8">
      <h2 className="text-3xl font-bold">DSA Progress</h2>

      {/* Summary */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 bg-gray-800/80 rounded-xl shadow-xl">
          <h3 className="text-xl">Solved</h3>
          <p className="text-4xl text-green-400">{solved.length}</p>
        </div>
        <div className="p-6 bg-gray-800/80 rounded-xl shadow-xl">
          <h3 className="text-xl">Remaining</h3>
          <p className="text-4xl text-yellow-400">{unsolved.length}</p>
        </div>
      </div>

      {/* Pie */}
      <div className="bg-gray-800/80 p-6 rounded-xl shadow-xl">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {pieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Unsolved */}
      <div className="bg-gray-800/80 p-6 rounded-xl shadow-xl">
        <h3 className="text-xl mb-4">Unsolved Questions</h3>
        {unsolved.length === 0 ? (
          <p>🎉 All solved!</p>
        ) : (
          <>
            <ul className="space-y-2">
              {displayedUnsolved.map((q) => (
                <li key={q} className="flex justify-between">
                  <a
                    href={`https://leetcode.com/problems/${q
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {q}
                  </a>
                  <button
                    onClick={() => markSolved(q)}
                    className="bg-green-600 px-2 rounded text-white"
                  >
                    ✅
                  </button>
                </li>
              ))}
            </ul>
            {unsolved.length > 10 && (
              <button
                onClick={() => setShowAllUnsolved((s) => !s)}
                className="mt-4 bg-blue-500 px-4 py-1 rounded text-white"
              >
                {showAllUnsolved ? "Read Less" : "Read More"}
              </button>
            )}
          </>
        )}
      </div>

      {/* Solved */}
      <div className="bg-gray-800/80 p-6 rounded-xl shadow-xl">
        <h3 className="text-xl mb-4">Solved Questions</h3>
        <ul className="space-y-2">
          {displayedSolved.map((q) => (
            <li key={q} className="flex justify-between">
              <a
                href={`https://leetcode.com/problems/${q
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {q}
              </a>
              <button
                onClick={() => markUnsolve(q)}
                className="bg-red-600 px-2 rounded text-white"
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
        {solved.length > 10 && (
          <button
            onClick={() => setShowAllSolved((s) => !s)}
            className="mt-4 bg-blue-500 px-4 py-1 rounded text-white"
          >
            {showAllSolved ? "Read Less" : "Read More"}
          </button>
        )}
      </div>
    </div>
  );
}
