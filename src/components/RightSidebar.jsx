import React from "react";
import Avatar from "./Avatar";
import { formatMoney } from "../constants";

export default function RightSidebar({ role, pledges }) {
  if (role === "investor") {
    return (
      <div className="hidden xl:block w-72 shrink-0 pt-4 pr-4">
        <p className="text-[#65676B] text-sm font-medium px-2 mb-2">Your pledges</p>
        {pledges.length === 0 ? (
          <p className="text-sm text-[#65676B] px-2">No pledges yet — back an idea to see it here.</p>
        ) : (
          <div className="space-y-2">
            {pledges.map((p) => (
              <div key={p.id} className="px-2 py-2 rounded-md hover:bg-[#F0F2F5] flex items-center justify-between text-sm">
                <span className="text-[#050505] truncate mr-2">{p.ideaTitle}</span>
                <span className="text-[#65676B] shrink-0">{formatMoney(p.amount)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="hidden xl:block w-72 shrink-0 pt-4 pr-4">
      <p className="text-[#65676B] text-sm font-medium px-2 mb-2">Tip</p>
      <p className="text-sm text-[#65676B] px-2 leading-relaxed">
        Ideas with a clear one-line pitch and a specific ask tend to get noticed faster.
      </p>
    </div>
  );
}
