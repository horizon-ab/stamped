"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

// Helper: get logged in user (from localStorage, as in Home page)
function getLoggedInUsername() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("stamped-username") || "";
  }
  return "";
}

// API helpers (all requests go through src/routes/api)
const API_BASE = "http://localhost:80/api";

// Types (adjust as needed to match your schema)
type User = {
  name: string;
  bio: string;
  joined: string;
  avatar: string;
};

type Stamp = {
  id: number;
  name: string;
  date: string;
  img: string;
  location: string;
  poi: string;
};

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [userStamps, setUserStamps] = useState<Stamp[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Load username from localStorage on mount
  useEffect(() => {
    setUsername(getLoggedInUsername());
  }, []);

  // Fetch user info and stamps from API
  useEffect(() => {
    if (!username) return;
    setLoading(true);
  
    // Get user info
    fetch(`${API_BASE}/user/${encodeURIComponent(username)}`)
      .then((res) => {
        if (!res.ok) throw new Error("User not found");
        return res.json();
      })
      .then((data: User) => setUser(data))
      .catch(() => setError("User not found"));
  
    // Get user's stamps and map to UI-friendly shape
    fetch(`${API_BASE}/stamp/getByUser/${encodeURIComponent(username)}`)
      .then((res) => res.json())
      .then((data) => {
        const stamps: Stamp[] = data.map((s: any, idx: number) => ({
          id: s.id ?? idx,
          name: s.challenge_name ?? "",
          date: s.datetime ?? "",
          img: s.photolink ?? "",
          location: s.location_name ?? "",
          poi: s.point_of_interest_name ?? "",
        }));
        setUserStamps(stamps);
      })
      .catch(() => setUserStamps([]))
      .finally(() => setLoading(false));
  }, [username]);

  // Responsive adjustments
  const [containerWidth, setContainerWidth] = useState(320);
  useEffect(() => {
    function handleResize() {
      const w = Math.min(window.innerWidth - 32, 360);
      setContainerWidth(w > 240 ? w : 240);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) {
    return (
      <main className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-2 py-8 animate-fadeIn">
        <div className="mt-32 text-indigo-400 text-lg animate-pulse">Loading profile...</div>
      </main>
    );
  }

  if (error || !user) {
    return (
      <main className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-2 py-8 animate-fadeIn">
        <nav
          className="w-full max-w-xs flex items-center mb-6 animate-fadeInUp"
          style={{ maxWidth: containerWidth }}
        >
          <Link
            href="/"
            className="text-indigo-400 text-lg font-bold hover:text-indigo-600 transition-colors"
          >
            &larr;
          </Link>
          <div className="flex-1 flex justify-center">
            <span className="text-lg font-semibold text-indigo-700">Profile</span>
          </div>
          <div className="w-6" />
        </nav>
        <div className="text-red-400 text-lg mt-32">{error || "Could not load user profile."}</div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-2 py-8 animate-fadeIn">
      {/* Header/Nav */}
      <nav
        className="w-full max-w-xs flex items-center mb-6 animate-fadeInUp"
        style={{ maxWidth: containerWidth }}
      >
        <Link
          href="/"
          className="text-indigo-400 text-lg font-bold hover:text-indigo-600 transition-colors"
        >
          &larr;
        </Link>
        <div className="flex-1 flex justify-center">
          <span className="text-lg font-semibold text-indigo-700">Profile</span>
        </div>
        <div className="w-6" />
      </nav>

      {/* Profile Info */}
      <section
        className="flex flex-col items-center w-full mb-6 animate-popIn"
        style={{ maxWidth: containerWidth }}
      >
        <div className="relative">
          <img
            src={user.avatar}
            alt="Profile avatar"
            className="w-24 h-24 rounded-full border-4 border-indigo-300 shadow-lg mb-3 object-cover"
          />
          <span className="absolute right-0 bottom-4 text-lg animate-heartBeat">
            🌎
          </span>
        </div>
        <h2 className="text-2xl font-bold text-indigo-800">{user.name}</h2>
        <p className="text-indigo-500 text-sm mb-2 text-center">{user.bio}</p>
        <div className="flex flex-col xs:flex-row gap-1 xs:gap-4 text-indigo-600 text-sm mb-2 items-center">
          <span className="flex items-center gap-1">
            🗓️ <span className="hidden xs:inline">Joined:</span>{" "}
            {new Date(user.joined).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1">
            🏅 {userStamps.length} <span className="hidden xs:inline">Stamps</span>
          </span>
        </div>
      </section>

      {/* Stamps Gallery */}
      <section
        className="w-full mb-10 animate-fadeInUp"
        style={{ maxWidth: containerWidth }}
      >
        <h3 className="text-indigo-700 font-semibold text-lg mb-3 flex items-center gap-2">
          <span>My Stamps</span>
          <span className="text-xs text-indigo-400">({userStamps.length})</span>
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          {userStamps.map((stamp, i) => (
            <div
              key={stamp.id}
              className="flex flex-col items-center bg-white rounded-lg p-2 shadow hover:scale-103 transition-transform animate-popIn3"
              style={{ animationDelay: `${i * 0.1 + 0.5}s` }}
            >
              <img
                src={stamp.img}
                alt={stamp.name}
                className="w-14 h-14 rounded-md object-cover mb-1"
              />
              <span className="text-xs text-indigo-700 font-semibold">
                {stamp.name}
              </span>
              <span className="text-[10px] text-indigo-400">
                {new Date(stamp.date).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
        {userStamps.length === 0 && (
          <div className="text-indigo-400 text-center mt-8 text-sm animate-fadeInSlow">
            No stamps collected yet. Start your journey!
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="mb-20 flex justify-center w-full">
        <span className="text-xs text-indigo-400 bg-white/80 rounded-full px-4 py-1 shadow pointer-events-auto">
          Made with <span className="animate-heartBeat inline-block">❤️</span> by Stamped
        </span>
      </footer>

      {/* Animations */}
      <style jsx global>{`
        @keyframes popIn {
          0% { transform: scale(0.7); opacity: 0; }
          70% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); }
        }
        @keyframes popIn3 {
          0% { opacity: 0; transform: scale(0.8);}
          100% { opacity: 1; transform: scale(1);}
        }
        @keyframes heartBeat {
          0%, 100% { transform: scale(1); }
          40% { transform: scale(1.3); }
          60% { transform: scale(0.8); }
          80% { transform: scale(1.1); }
        }
        .animate-popIn { animation: popIn 0.7s both; }
        .animate-popIn3 { animation: popIn3 0.7s both; }
        .animate-heartBeat { animation: heartBeat 1.5s infinite; }
        .animate-fadeIn { animation: fadeIn 0.7s both;}
        .animate-fadeInUp { animation: fadeInUp 0.7s both;}
        .animate-fadeInSlow { animation: fadeIn 1.5s both;}
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px);}
          to { opacity: 1; transform: translateY(0);}
        }
        @keyframes fadeIn { from { opacity: 0;} to { opacity: 1;} }
      `}</style>
    </main>
  );
}