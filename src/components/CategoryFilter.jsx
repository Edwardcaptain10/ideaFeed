import React from "react";
import { Filter } from "lucide-react";
import { CATEGORIES } from "../constants";

export default function CategoryFilter({ active, onChange }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      <button
        onClick={() => onChange(null)}
        className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
          !active ? "bg-[#1877F2] text-white border-[#1877F2]" : "border-[#DADDE1] text-[#65676B] bg-white"
        }`}
      >
        <Filter size={12} /> All
      </button>
      {CATEGORIES.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border ${
            active === c ? "bg-[#1877F2] text-white border-[#1877F2]" : "border-[#DADDE1] text-[#65676B] bg-white"
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
