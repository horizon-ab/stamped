"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import FooterNav from "../components/footerNav";
import { ProfileGenerator } from "../utils/MockDataGenerator";
// schema of image info tbm
const sampleStamps = [
    {
      name: "New York",
      date: "2025-04-10",
      img: "https://th.bing.com/th/id/OIP.vQCstI2DgQqZHTmBpvR8OgHaEC?w=285&h=180&c=7&r=0&o=5&dpr=2.2&pid=1.7",
    },
    {
      name: "Tokyo",
      date: "2025-03-25",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Tokyo_Tower_and_around_Skyscrapers.jpg/320px-Tokyo_Tower_and_around_Skyscrapers.jpg",
    },
    {
      name: "Paris",
      date: "2025-02-14",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Paris_Night.jpg/320px-Paris_Night.jpg",
    },
    {
      name: "Sydney",
      date: "2025-01-05",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Sydney_Opera_House_and_Harbour_Bridge_Dusk_%282%29_2019-06-21.jpg/320px-Sydney_Opera_House_and_Harbour_Bridge_Dusk_%282%29_2019-06-21.jpg",
    },
    {
      name: "Santa Barbara",
      date: "2024-12-15",
      img: "https://th.bing.com/th/id/R.b93ad928cda4d6743547b228d21d8ed2?rik=kFkQIFYAXz1yUQ&pid=ImgRaw&r=0",
    },
    {
      name: "Antioch",
      date: "2024-11-20",
      img: "https://th.bing.com/th/id/OIP.FYdKR5fsFQAxbXyXJcg7oQHaEO?w=283&h=180&c=7&r=0&o=5&dpr=2.2&pid=1.7",
    }
];

const Profile: React.FC = () => {
  const [username, setUsername] = useState("Guest")
  // Mock user schema tbm
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("stamped-username");
      if (stored) setUsername(stored);
    }
  }, []);
  const user = {
    name: username,
    avatar: ProfileGenerator.randomAvatar(),
    bio: ProfileGenerator.randomBio(),
    stampsCollected: sampleStamps.length,
    joined: ProfileGenerator.randomDate(),
  };

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
            🏅 {user.stampsCollected}{" "}
            <span className="hidden xs:inline">Stamps</span>
          </span>
        </div>
      </section>

      {/* Stamps Gallery */}
      <section
        className="w-full mb-10 animate-fadeInUp"
        style={{ maxWidth: containerWidth }}
      >
        <h3 className="text-indigo-700 font-semibold text-lg mb-3 flex items-center gap-2">
          <span className="animate-popIn2">📬</span>
          Your Stamps
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          {sampleStamps.map((stamp, i) => (
            <div
              key={i}
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
        {sampleStamps.length === 0 && (
          <div className="text-indigo-400 text-center mt-8 text-sm animate-fadeInSlow">
            No stamps collected yet. Start your journey!
          </div>
        )}
      </section>
      {sampleStamps.length === 0 ? (
        <>
          <Link
            href="/map"
            className="w-full mb-15 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow text-center transition-all duration-200 active:scale-95 animate-fadeInUp"
            style={{ maxWidth: 360 }}
          >
            Open Map & Collect your first stamp!
          </Link>
          <FooterNav />
        </>
      ) : (
        <>
          <Link
            href="/map"
            className="w-full mb-15 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow text-center transition-all duration-200 active:scale-95 animate-fadeInUp"
            style={{ maxWidth: 360 }}
          >
            Open Map & Collect More Stamps
          </Link>
          <FooterNav />
        </>
      )}

      <FooterNav />

      {/* Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fadeInSlow {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes popIn {
          0% {
            transform: scale(0.7);
            opacity: 0;
          }
          70% {
            transform: scale(1.11);
            opacity: 1;
          }
          100% {
            transform: scale(1);
          }
        }
        @keyframes popIn2 {
          0% {
            transform: scale(0.6);
            opacity: 0;
          }
          60% {
            transform: scale(1.15);
            opacity: 1;
          }
          100% {
            transform: scale(1);
          }
        }
        @keyframes popIn3 {
          0% {
            transform: scale(0.7);
            opacity: 0;
          }
          80% {
            transform: scale(1.07);
            opacity: 1;
          }
          100% {
            transform: scale(1);
          }
        }
        @keyframes heartBeat {
          0%,
          100% {
            transform: scale(1);
          }
          40% {
            transform: scale(1.3);
          }
          60% {
            transform: scale(0.8);
          }
          80% {
            transform: scale(1.1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s both;
        }
        .animate-fadeInSlow {
          animation: fadeInSlow 1.1s both;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s both;
        }
        .animate-popIn {
          animation: popIn 0.7s both;
        }
        .animate-popIn2 {
          animation: popIn2 1s both 0.2s;
        }
        .animate-popIn3 {
          animation: popIn3 0.7s both;
        }
        .animate-heartBeat {
          animation: heartBeat 1.5s infinite;
        }
      `}</style>
    </main>
  );
};

export default Profile;