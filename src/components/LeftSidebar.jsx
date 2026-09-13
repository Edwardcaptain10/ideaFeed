import React from "react";
import { Home, Users, Bookmark, TrendingUp } from "lucide-react";

export default function LeftSidebar({ role }) {
  const items =
    role === "entrepreneur"
      ? [
          { icon: Home, label: "Feed" },
          { icon: Users, label: "Investors" },
          { icon: TrendingUp, label: "Your ideas" },
        ]
      : [
          { icon: Home, label: "Feed" },
          { icon: Bookmark, label: "Your pledges" },
          { icon: TrendingUp, label: "Trending ideas" },
        ];

  return (
    <div className="hidden lg:block w-64 shrink-0 pt-4 pl-4">
      {items.map(({ icon: Icon, label }) => (
        <button
          key={label}
          className="w-full flex items-center gap-3 px-2 py-2.5 rounded-md hover:bg-[#F0F2F5] text-sm text-[#050505]"
        >
          <Icon size={20} className="text-[#1877F2]" />
          {label}
        </button>
      ))}
    </div>
  );
}
