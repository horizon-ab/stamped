"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import clsx from "clsx";

// Animated underline and icon bounce for active tab
const navItems = [
  {
    href: "/home",
    label: "Home",
    icon: "🏠",
  },
  {
    href: "/map",
    label: "Map",
    icon: "🗺️",
  },
  {
    href: "/profile",
    label: "Profile",
    icon: "👤",
  },
];

function FooterNav() {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-2 left-0 w-full flex justify-center z-50">
      <nav className="flex gap-8 bg-white/90 px-6 py-2 rounded-xl shadow-lg backdrop-blur supports-[backdrop-filter]:backdrop-blur-md animate-fadeInUp">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href === "/home" && pathname === "/");
          return (
            <Link
              prefetch={false}
              key={item.href}
              href={item.href}
              className={clsx(
                "relative flex flex-col items-center transition-all duration-200",
                active
                  ? "text-indigo-700 font-bold"
                  : "text-indigo-400 hover:text-indigo-600"
              )}
              aria-current={active ? "page" : undefined}
            >
              <span
                className={clsx(
                  "text-lg transition-transform duration-300",
                  active ? "animate-bounce-shortest" : ""
                )}
              >
                {item.icon}
              </span>
              <span className="text-xs">{item.label}</span>
              {/* Animated underline */}
              <span
                className={clsx(
                  "absolute left-1/2 -bottom-1 w-5 h-1 rounded-full bg-indigo-400 transition-all duration-300",
                  active
                    ? "opacity-100 scale-x-100 -translate-x-1/2"
                    : "opacity-0 scale-x-50 -translate-x-1/2"
                )}
              />
            </Link>
          );
        })}
      </nav>
      {/* Animations: fade in up for nav, bounce for active icon */}
      <style jsx global>{`
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
        .animate-fadeInUp {
          animation: fadeInUp 0.5s cubic-bezier(0.32,0.72,0.44,1) both;
        }
        @keyframes bounce-shortest {
          0%,
          100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-8px) scale(1.18);
          }
          60% {
            transform: translateY(2px) scale(0.95);
          }
        }
        .animate-bounce-shortest {
          animation: bounce-shortest 0.6s;
        }
      `}</style>
    </footer>
  );
}

export default FooterNav;