import React from "react";

function avatarColor(name) {
  const palette = ["#1877F2", "#00A884", "#F0B429", "#E4405F", "#7C4DFF"];
  const idx = (name ? name.charCodeAt(0) : 0) % palette.length;
  return palette[idx];
}

export default function Avatar({ name, size = 40 }) {
  const initials = (name || "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-medium shrink-0"
      style={{ width: size, height: size, backgroundColor: avatarColor(name || "?"), fontSize: size * 0.4 }}
    >
      {initials || "?"}
    </div>
  );
}
