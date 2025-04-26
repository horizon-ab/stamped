"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import dotenv from 'dotenv';
dotenv.config();
// Helper to get user's location
function useCurrentPosition() {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      // fallback: show default location (NYC) if denied or failed
      () => setPosition({ lat: 40.7128, lng: -74.006 }),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 10000,
      }
    );
  }, []);
  return position;
}

// Helper to build Google Static Maps URL
function getStaticMapUrl(
  lat: number,
  lng: number,
  radiusMiles: number = 6,
  size = "300x400"
) {
  // Calculate zoom level for the radius (approximate)
  // Zoom level formula: zoom = log2(156543.03392 * cos(latitude * PI/180) * (width in px)/ (radius in meters * 2))
  // For ~6 miles (9600 meters), width=300px
  // We'll use zoom=13 for ~5-6 miles radius at phone resolution
  const zoom = 13;

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyDoK3owtqGo-O4apQg40khuCaJiePFvZHA";
  // Add a red pin for current location (&markers)
  console.log(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
  return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${size}&maptype=roadmap&markers=color:red%7Clabel:U%7C${lat},${lng}&key=${apiKey}`;
}

const Home: React.FC = () => {
  const position = useCurrentPosition();

  // Image size for phone, keep aspect ratio
  const imgSize = { width: 300, height: 400 };

  return (
    <main className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      {/* App Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white text-3xl font-bold">🗺️</span>
        </div>
        <h1 className="mt-4 text-3xl font-extrabold text-indigo-700 tracking-tight">
          Stamped
        </h1>
        <p className="mt-1 text-indigo-400 font-medium text-sm">
          Collect stamps as you travel!
        </p>
      </div>

      {/* Hero Section */}
      <section className="w-full max-w-xs flex flex-col items-center relative">
        {/* Map Image with Current Location */}
        <div
          className="relative mb-6 rounded-lg overflow-hidden shadow-md"
          style={{
            width: imgSize.width,
            height: imgSize.height,
          }}
        >
          {position ? (
            <img
              src={getStaticMapUrl(position.lat, position.lng, 6, `${imgSize.width}x${imgSize.height}`)}
              alt="Map centered on your location"
              className="w-full h-full object-cover"
              draggable={false}
              width={imgSize.width}
              height={imgSize.height}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-indigo-100 text-indigo-400 text-lg">
              Getting your location...
            </div>
          )}
          {/* Optional: More pinpoints for visual effect (static/fake for demo) */}
          {position && (
            <>
              {/* Pinpoint emoji overlays (for demo, at offset %) */}
              <span className="absolute left-[65%] top-[40%] z-10 text-xl">📍</span>
              <span className="absolute left-[25%] top-[60%] z-10 text-xl">📍</span>
              <span className="absolute left-[50%] top-[25%] z-10 text-xl">📍</span>
            </>
          )}
        </div>

        <h2 className="text-lg font-semibold text-indigo-800 text-center mb-2">
          Prove your adventures!
        </h2>
        <p className="text-sm text-indigo-600 text-center mb-4">
          Upload photos at world destinations, collect digital stamps, and build your travel passport.
        </p>

        <ul className="text-indigo-700 text-sm mb-6 flex flex-col gap-2">
          <li>📍 Upload images at points of interest</li>
          <li>📸 Verify your journeys with photos</li>
          <li>🏅 Earn unique stamps for each location</li>
        </ul>

        <Link
          href="/map"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow text-center transition"
        >
          Open Map & Collect Stamps
        </Link>
      </section>

      {/* Footer */}
      <footer className="fixed bottom-2 left-0 w-full flex justify-center">
        <span className="text-xs text-indigo-400">Made with ❤️ by Stamped</span>
      </footer>
    </main>
  );
};

export default Home;