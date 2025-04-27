"use client";
import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// LocalStorage-based authy hook
function useAuth() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  // On mount, check localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("stamped-username");
      setLoggedIn(!!user);
      setUsername(user);
    }
  }, []);

  const login = (user: string) => {
    setUsername(user);
    setLoggedIn(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("stamped-username", user);
    }
  };

  const logout = () => {
    setUsername(null);
    setLoggedIn(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("stamped-username");
    }
  };

  return { loggedIn, username, login, logout };
}

function getStaticMapUrl(
  lat: number,
  lng: number,
  size = "340x440"
) {
  const zoom = 13;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
  return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${size}&scale=2&maptype=roadmap&markers=color:red%7Clabel:U%7C${lat},${lng}&key=${apiKey}`;
}

function useCurrentPosition() {
  const [position, setPosition] = React.useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported.");
      setPosition({ lat: 34.06999972, lng: -118.439789907 });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {
        setError("Location unavailable. Showing default area.");
        setPosition({ lat: 34.06999972, lng: -118.439789907 });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 }
    );
  }, []);
  return { position, error };
}

const Home: React.FC = () => {
  const { position, error } = useCurrentPosition();
  const [isExpanding, setIsExpanding] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Auth logic
  const { loggedIn, username, login, logout } = useAuth();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  // Responsive: use window width (max 360px), keep 5:6 aspect ratio
  const [mapWidth, setMapWidth] = useState(320);
  React.useEffect(() => {
    function handleResize() {
      const w = Math.min(window.innerWidth - 32, 360); // 16px padding each side
      setMapWidth(w > 240 ? w : 240);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const mapHeight = Math.round((mapWidth / 5) * 6);

  const handleMapClick = () => {
    setIsExpanding(true);
    setTimeout(() => {
      router.push("/map");
    }, 600);
  };

  const expandedMapSize = "640x640";

  function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!loginUsername || !loginPassword) {
      setLoginError("Please enter both username and password.");
      return;
    }
    setLoginError(null);
    login(loginUsername);
    setShowLoginForm(false);
    setLoginUsername("");
    setLoginPassword("");
  }

  function handleLogout() {
    logout();
    setShowLoginForm(false);
  }

  function handleLoginClick() {
    setShowLoginForm(true);
    setLoginError(null);
    setLoginUsername("");
    setLoginPassword("");
  }

  function handleExitLoginForm() {
    setShowLoginForm(false);
    setLoginError(null);
    setLoginUsername("");
    setLoginPassword("");
  }

  return (
    <main className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-2 py-8 animate-fadeIn">
      {/* App Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg animate-popIn">
          <span className="text-white text-3xl font-bold">🗺️</span>
        </div>
        <h1 className="mt-4 text-3xl font-extrabold text-indigo-700 tracking-tight">
          Stamped
        </h1>
        <p className="mt-1 text-indigo-400 font-medium text-sm text-center">
          Collect stamps as you travel!
        </p>
      </div>

      {/* Hero Section */}
      <section className="w-full max-w-xs flex flex-col items-center relative mb-8">
        <div
          ref={mapRef}
          className={`relative mb-6 rounded-xl overflow-hidden shadow-xl bg-white cursor-pointer transition-all duration-500 
            ${
              isExpanding
                ? "z-50 fixed left-0 top-0 w-screen h-screen m-0 rounded-none growMap"
                : ""
            }`}
          style={{
            width: isExpanding ? "100vw" : mapWidth,
            height: isExpanding ? "100vh" : mapHeight,
            maxWidth: isExpanding ? "100vw" : undefined,
            maxHeight: isExpanding ? "100vh" : undefined,
            transition: "all 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)",
          }}
          onClick={handleMapClick}
          aria-label="Expand map"
          title="Tap to open big map"
        >
          {position ? (
            <img
              src={getStaticMapUrl(
                position.lat,
                position.lng,
                isExpanding
                  ? expandedMapSize
                  : `${Math.round(mapWidth)}x${mapHeight}`
              )}
              alt="Map centered on your location"
              className="w-full h-full object-cover animate-fadeInSlow border-2 border-black rounded-xl shadow-lg"
              draggable={false}
              width={isExpanding ? 640 : mapWidth}
              height={isExpanding ? 640 : mapHeight}
              style={{ transition: "opacity 0.5s" }}
              loading="lazy"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-indigo-100 text-indigo-400 text-lg animate-pulse">
              Getting your location...
            </div>
          )}
          {position && (
            <>
              <span className="absolute left-[65%] top-[40%] z-10 text-xl animate-pinBounce">
                📍
              </span>
              <span className="absolute left-[25%] top-[60%] z-10 text-xl animate-pinBounce2">
                📍
              </span>
              <span className="absolute left-[50%] top-[25%] z-10 text-xl animate-pinBounce3">
                📍
              </span>
              {!isExpanding && (
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/80 px-3 py-1 rounded-full text-xs font-medium text-indigo-700 shadow animate-fadeInUp pointer-events-none">
                  Tap to expand
                </span>
              )}
            </>
          )}
        </div>

        {error && (
          <div className="text-red-400 text-xs mb-2 text-center animate-shakeX">
            {error}
          </div>
        )}
        <h2 className="text-lg font-semibold text-indigo-800 text-center mb-2">
          Prove your adventures!
        </h2>
        <p className="text-sm text-indigo-600 text-center mb-4">
          Upload photos at world destinations, collect digital stamps, and build
          your travel passport.
        </p>

        <ul className="flex flex-col gap-4 w-full px-2 mb-6">
          <li className="flex items-center">
            <div className="flex items-center gap-3 w-full bg-white/80 rounded-lg shadow-md p-4 transition hover:scale-[1.025] hover:shadow-lg group">
              <span className="text-xl animate-popIn group-hover:scale-110 transition">
                📍
              </span>
              <div>
                <span className="block text-indigo-800 font-semibold">
                  Upload images at unique waypoints{" "}
                </span>
                <span className="block text-xs text-indigo-400 mt-1">
                  Pin memories at each destination you visit!
                </span>
              </div>
            </div>
          </li>
          <li className="flex items-center">
            <div className="flex items-center gap-3 w-full bg-white/80 rounded-lg shadow-md p-4 transition hover:scale-[1.025] hover:shadow-lg group">
              <span className="text-xl animate-popIn2 group-hover:scale-110 transition">
                📸
              </span>
              <div>
                <span className="block text-indigo-800 font-semibold">
                  Verify your journeys with photos
                </span>
                <span className="block text-xs text-indigo-400 mt-1">
                  Show proof of your travels and keep up your adventure-collage.
                </span>
              </div>
            </div>
          </li>
          <li className="flex items-center">
            <div className="flex items-center gap-3 w-full bg-white/80 rounded-lg shadow-md p-4 transition hover:scale-[1.025] hover:shadow-lg group">
              <span className="text-xl animate-popIn3 group-hover:scale-110 transition">
                🏅
              </span>
              <div>
                <span className="block text-indigo-800 font-semibold">
                  Earn unique stamps for each location
                </span>
                <span className="block text-xs text-indigo-400 mt-1">
                  Collect digital badges for every place you explore.
                </span>
              </div>
            </div>
          </li>
        </ul>

        {/* Login/Logout section with original margin and no fixed position */}
        {!loggedIn && !showLoginForm && (
          <button
            className="rounded-lg px-6 py-3 w-full font-semibold text-white shadow transition-all bg-indigo-600 hover:bg-indigo-700 active:scale-95 animate-fadeInUp mt-5"
            onClick={handleLoginClick}
          >
            Log in
          </button>
        )}
        {!loggedIn && showLoginForm && (
          <div className="relative w-full flex flex-col items-center animate-fadeInUp mt-2">
            {/* Exit button */}
            <button
              onClick={handleExitLoginForm}
              className="absolute right-0.5 top-0 text-indigo-400 hover:text-indigo-700 text-xl font-bold transition-colors"
              aria-label="Exit login form"
              type="button"
              tabIndex={0}
            >
              ×
            </button>
            <form
              onSubmit={handleLoginSubmit}
              className="flex flex-col gap-2 w-full bg-white/90 p-4 rounded-xl shadow"
              style={{ animationDelay: "0.1s" }}
            >
              <input
                type="text"
                className="rounded-md border px-3 py-2 text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                placeholder="Username"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                autoFocus
              />
              <input
                type="password"
                className="rounded-md border px-3 py-2 text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              <button
                type="submit"
                className="rounded-md bg-indigo-600 text-white font-semibold py-2 mt-1 hover:bg-indigo-700 transition"
              >
                Log in
              </button>
              {loginError && (
                <div className="text-xs text-red-500 text-center">
                  {loginError}
                </div>
              )}
              <div className="text-xs text-center text-indigo-600 mt-1">
                Not registered?{" "}
                <a href="#" className="underline hover:text-indigo-800">
                  Create account
                </a>
              </div>
            </form>
          </div>
        )}
        {loggedIn && (
          <button
            className="rounded-lg px-6 py-3 w-full font-semibold text-white shadow transition-all bg-indigo-600 hover:bg-indigo-700 active:scale-95 animate-fadeInUp mt-2"
            onClick={handleLogout}
          >
            Log out{" "}
            {username && (
              <span className="font-normal text-indigo-200">({username})</span>
            )}
          </button>
        )}
      </section>

      {/* Footer */}
      <footer className="mb-20 flex justify-center w-full">
        <span className="text-xs text-indigo-400 bg-white/80 rounded-full px-4 py-1 shadow pointer-events-auto">
          Made with <span className="animate-heartBeat inline-block">❤️</span>{" "}
          by Stamped
        </span>
      </footer>

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
            transform: translateY(16px);
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
            transform: scale(1.15);
            opacity: 1;
          }
          100% {
            transform: scale(1);
          }
        }
        @keyframes pinBounce {
          0%,
          100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-8px) scale(1.18);
          }
          60% {
            transform: translateY(2px) scale(0.97);
          }
        }
        @keyframes pinBounce2 {
          0%,
          100% {
            transform: translateY(0);
          }
          20% {
            transform: translateY(-7px) scale(1.14);
          }
          70% {
            transform: translateY(2px) scale(0.96);
          }
        }
        @keyframes pinBounce3 {
          0%,
          100% {
            transform: translateY(0);
          }
          35% {
            transform: translateY(-10px) scale(1.2);
          }
          65% {
            transform: translateY(2px) scale(0.95);
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
        @keyframes shakeX {
          10%,
          90% {
            transform: translateX(-1px);
          }
          20%,
          80% {
            transform: translateX(2px);
          }
          30%,
          50%,
          70% {
            transform: translateX(-4px);
          }
          40%,
          60% {
            transform: translateX(4px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.7s both;
        }
        .animate-fadeInSlow {
          animation: fadeInSlow 1.2s both;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.7s both;
        }
        .animate-popIn {
          animation: popIn 0.7s both;
        }
        .animate-popIn2 {
          animation: popIn 0.8s both 0.1s;
        }
        .animate-popIn3 {
          animation: popIn 0.85s both 0.2s;
        }
        .animate-pinBounce {
          animation: pinBounce 1.2s both 0.3s;
        }
        .animate-pinBounce2 {
          animation: pinBounce2 1.5s both 0.5s;
        }
        .animate-pinBounce3 {
          animation: pinBounce3 1.1s both 0.4s;
        }
        .animate-heartBeat {
          animation: heartBeat 1.5s infinite;
        }
        .animate-shakeX {
          animation: shakeX 0.4s both;
        }
        .growMap {
          animation: growMapAnim 0.6s cubic-bezier(0.4, 0.2, 0.2, 1) both;
        }
        @keyframes growMapAnim {
          0% {
            width: ${mapWidth}px;
            height: ${mapHeight}px;
            left: 50%;
            top: 130px;
            transform: translate(-50%, 0);
            border-radius: 1rem;
          }
          100% {
            width: 100vw;
            height: 100vh;
            left: 0;
            top: 0;
            transform: none;
            border-radius: 0;
          }
        }
      `}</style>
    </main>
  );
};

export default Home;